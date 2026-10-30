-- Optional public, curated reference retrieval. No births, charts, questions or accounts.
-- This migration is deployable source; it does not establish a configured hosted project.
begin;
create table if not exists public.sky_reference_chunks (
  id text primary key check (length(id) between 1 and 120),
  source_id text not null check (length(source_id) between 1 and 120),
  title text not null check (length(title) between 1 and 500),
  body text not null check (length(body) between 1 and 12000),
  locator text not null check (length(locator) between 1 and 2000),
  url text not null check (url ~ '^https?://' and length(url) <= 2000),
  claim_type text not null check (length(claim_type) <= 100),
  reading_status text not null check (length(reading_status) <= 3000),
  rights text not null check (length(rights) <= 3000),
  lens_ids text[] not null default '{}' check (cardinality(lens_ids) <= 4),
  content_sha256 text not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
  published boolean not null default false,
  search_document tsvector generated always as (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', body), 'B')
  ) stored
);
create index if not exists sky_reference_search_idx on public.sky_reference_chunks using gin(search_document);
alter table public.sky_reference_chunks enable row level security;
drop policy if exists sky_reference_public_read on public.sky_reference_chunks;
create policy sky_reference_public_read on public.sky_reference_chunks for select to anon, authenticated using (published);
revoke all on public.sky_reference_chunks from public, anon, authenticated;
grant select on public.sky_reference_chunks to anon, authenticated;
-- Supabase service_role may manage only explicitly curated non-personal chunks.
grant select, insert, update, delete on public.sky_reference_chunks to service_role;

create or replace function public.search_sky_reference(query_text text, match_count integer default 4)
returns table(id text,source_id text,title text,body text,locator text,url text,claim_type text,reading_status text,rights text,lens_ids text[],content_sha256 text,rank real)
language plpgsql stable security invoker set search_path = '' as $$
declare terms tsquery;
begin
  if query_text is null or length(query_text) > 1000 then raise exception 'Query must contain at most 1000 characters'; end if;
  if match_count is null or match_count < 1 or match_count > 8 then raise exception 'Retrieve 1 to 8 chunks'; end if;
  terms := websearch_to_tsquery('english', query_text);
  return query select c.id,c.source_id,c.title,c.body,c.locator,c.url,c.claim_type,c.reading_status,c.rights,c.lens_ids,c.content_sha256,ts_rank(c.search_document,terms)
    from public.sky_reference_chunks as c
    where c.published and c.search_document @@ terms
    order by ts_rank(c.search_document,terms) desc,c.id
    limit match_count;
end;
$$;
revoke all on function public.search_sky_reference(text,integer) from public;
grant execute on function public.search_sky_reference(text,integer) to anon, authenticated;
commit;
