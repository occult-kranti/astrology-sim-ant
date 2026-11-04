-- Optional public source retrieval, not a chart/chat/account database.
-- Migration source and local tests do not establish a hosted deployment.
begin;

-- Keep transformation helpers outside Supabase's default exposed public schema.
create schema if not exists workbench_private;
revoke all on schema workbench_private from public;
grant usage on schema workbench_private to anon, authenticated, service_role;

-- TEXT[] conversion is independent of session date/number output settings.
create or replace function workbench_private.workbench_rag_tag_text(value text[])
returns text language sql immutable parallel safe set search_path = pg_catalog
as $$ select coalesce(array_to_string(value, ' '), '') $$;

create table if not exists public.workbench_reference_chunks (
  id text primary key check (length(id) between 1 and 120),
  source_id text not null check (length(source_id) between 1 and 160),
  title text not null check (length(title) between 1 and 500),
  body text not null check (length(body) between 1 and 12000),
  category text not null check (category ~ '^[a-z][a-z0-9-]{0,79}$'),
  tags text[] not null default '{}' check (cardinality(tags) <= 32),
  file_path text not null check (length(file_path) between 1 and 2000),
  locator text not null check (length(locator) <= 2000),
  url text not null check (length(url) between 1 and 2000 and (url ~ '^https?://' or (url ~ '^([A-Za-z0-9_-]+/)*[A-Za-z0-9_.-]+(#[A-Za-z0-9_.:-]+)?$' and url !~ '(^|/)\.\.(/|#|$)'))),
  reading_depth text not null check (length(reading_depth) between 1 and 3000),
  rights_scope text not null check (length(rights_scope) between 1 and 3000),
  source_reading_depth text not null check (length(source_reading_depth) between 1 and 3000),
  source_file_sha256 text not null check (source_file_sha256 ~ '^[0-9a-f]{64}$'),
  content_sha256 text not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
  published boolean not null default false,
  search_english tsvector generated always as (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', workbench_private.workbench_rag_tag_text(tags) || ' ' || category), 'B') ||
    setweight(to_tsvector('english', body), 'C')
  ) stored,
  search_simple tsvector generated always as (
    setweight(to_tsvector('simple', title), 'A') ||
    setweight(to_tsvector('simple', workbench_private.workbench_rag_tag_text(tags) || ' ' || category || ' ' || source_id), 'B') ||
    setweight(to_tsvector('simple', body), 'C')
  ) stored
);
create index if not exists workbench_reference_english_idx on public.workbench_reference_chunks using gin(search_english);
create index if not exists workbench_reference_simple_idx on public.workbench_reference_chunks using gin(search_simple);
create index if not exists workbench_reference_category_idx on public.workbench_reference_chunks(category) where published;
alter table public.workbench_reference_chunks enable row level security;
drop policy if exists workbench_reference_published_read on public.workbench_reference_chunks;
create policy workbench_reference_published_read on public.workbench_reference_chunks
  for select to anon, authenticated using (published);
revoke all on public.workbench_reference_chunks from public, anon, authenticated;
grant select on public.workbench_reference_chunks to anon, authenticated;
-- Use only in a trusted administrative context, never in browser configuration.
grant select, insert, update, delete on public.workbench_reference_chunks to service_role;

-- Broad lexical retrieval: a quoted disjunction of at most 64 normalized lexemes.
-- Input is never executed as SQL or directly parsed as user-supplied tsquery syntax.
-- English stopwords are excluded from both tracks; simple preserves exact forms.
create or replace function workbench_private.workbench_rag_query(value text, dictionary regconfig)
returns tsquery language sql immutable parallel safe set search_path = pg_catalog
as $$
  select to_tsquery('simple', coalesce(string_agg(quote_literal(term), ' | '), ''))
  from (
    select term from unnest(tsvector_to_array(to_tsvector(dictionary, case when length(value) <= 1000 then value else '' end))) as term
    where numnode(plainto_tsquery('english', term)) > 0
    order by term limit 64
  ) as terms
$$;

revoke all on function workbench_private.workbench_rag_tag_text(text[]) from public;
revoke all on function workbench_private.workbench_rag_query(text,regconfig) from public;
grant execute on function workbench_private.workbench_rag_tag_text(text[]) to service_role;
grant execute on function workbench_private.workbench_rag_query(text,regconfig) to anon, authenticated, service_role;

create or replace function public.search_workbench_reference(
  query_text text,
  match_count integer default 6,
  category_filter text default null
)
returns table (
  id text, source_id text, title text, body text, category text, tags text[],
  file_path text, locator text, url text, reading_depth text, rights_scope text,
  source_reading_depth text, source_file_sha256 text, content_sha256 text, rank real
)
language plpgsql stable security invoker set search_path = '' as $$
declare english_terms tsquery; exact_terms tsquery;
begin
  if query_text is null or length(query_text) > 1000 then
    raise exception using errcode = '22023', message = 'Query must contain at most 1000 characters';
  end if;
  if match_count is null or match_count < 1 or match_count > 12 then
    raise exception using errcode = '22023', message = 'Retrieve 1 to 12 chunks';
  end if;
  if category_filter is not null and category_filter !~ '^[a-z][a-z0-9-]{0,79}$' then
    raise exception using errcode = '22023', message = 'Category must be a short lowercase identifier';
  end if;
  if length(btrim(query_text)) = 0 then return; end if;
  english_terms := workbench_private.workbench_rag_query(query_text, 'english');
  exact_terms := workbench_private.workbench_rag_query(query_text, 'simple');
  if numnode(english_terms) = 0 and numnode(exact_terms) = 0 then return; end if;
  return query
    select c.id,c.source_id,c.title,c.body,c.category,c.tags,c.file_path,c.locator,
      c.url,c.reading_depth,c.rights_scope,c.source_reading_depth,c.source_file_sha256,c.content_sha256,
      (2 * ts_rank_cd(c.search_english,english_terms,32) + ts_rank_cd(c.search_simple,exact_terms,32))::real as lexical_rank
    from public.workbench_reference_chunks as c
    where c.published and (category_filter is null or c.category = category_filter)
      and (c.search_english @@ english_terms or c.search_simple @@ exact_terms)
    order by lexical_rank desc,c.id
    limit match_count;
end;
$$;
revoke all on function public.search_workbench_reference(text,integer,text) from public;
grant execute on function public.search_workbench_reference(text,integer,text) to anon, authenticated, service_role;
comment on table public.workbench_reference_chunks is 'Reviewed public source chunks only. Never upload private births, chart exports, chat logs, credentials or imported books without rights.';
comment on function public.search_workbench_reference(text,integer,text) is 'Published-only invoker lexical retrieval. Rank is relevance, not truth, interpretive validity, or model confidence.';
commit;
