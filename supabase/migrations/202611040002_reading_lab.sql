-- Optional public reference examples; no personal readings, chat or model data.
begin;
create schema if not exists workbench_private;
revoke all on schema workbench_private from public;
grant usage on schema workbench_private to anon, authenticated, service_role;

create or replace function workbench_private.reading_lab_sources_valid(items jsonb, ids text[])
returns boolean language plpgsql immutable security invoker set search_path = pg_catalog as $$
declare item jsonb; expected_id text; position integer := 0; field text;
begin
  if jsonb_typeof(items) <> 'array' or cardinality(ids) < 1 or cardinality(ids) > 12
     or jsonb_array_length(items) <> cardinality(ids) then return false; end if;
  for item in select value from jsonb_array_elements(items) loop
    position := position + 1; expected_id := ids[position];
    if jsonb_typeof(item) <> 'object' or expected_id is null or expected_id !~ '^[a-z][a-z0-9-]{0,119}$'
       or item->>'id' is distinct from expected_id then return false; end if;
    foreach field in array array['title','url','locator','readingDepth','rights'] loop
      if jsonb_typeof(item->field) is distinct from 'string'
         or length(item->>field) not between 1 and 5000 then return false; end if;
    end loop;
    if item->>'url' !~ '^https://' then return false; end if;
  end loop;
  return true;
end;
$$;
revoke all on function workbench_private.reading_lab_sources_valid(jsonb,text[]) from public;
grant execute on function workbench_private.reading_lab_sources_valid(jsonb,text[]) to service_role;

create table if not exists public.reading_lab_examples (
  id text primary key check (id ~ '^[a-z][a-z0-9-]{0,119}$'),
  dataset_id text not null check (dataset_id = 'reading-lab-public-v1'),
  tradition_id text not null check (tradition_id in ('egyptian','mayan','dee','lilly','vedic','chinese','hebrew','jung','plato')),
  title text not null check (length(title) between 1 and 500),
  method_id text not null check (length(method_id) <= 120),
  kind text not null check (kind in ('textual-method','calendar-check','worked-chart')),
  status text not null check (status in ('not-numerically-evaluable','reference-fields-match','reference-mismatch')),
  source_ids text[] not null,
  sources jsonb not null check (octet_length(sources::text) <= 80000 and workbench_private.reading_lab_sources_valid(sources,source_ids)),
  case_data jsonb not null check (jsonb_typeof(case_data) = 'object' and octet_length(case_data::text) <= 60000),
  field_checks jsonb not null check (jsonb_typeof(field_checks) = 'array' and jsonb_array_length(field_checks) <= 64),
  result_summary jsonb not null check (jsonb_typeof(result_summary) = 'object' and octet_length(result_summary::text) <= 30000),
  matched_fields integer not null check (matched_fields >= 0),
  total_reference_fields integer not null check (total_reference_fields between 0 and 64 and matched_fields <= total_reference_fields),
  outcome_evaluable boolean not null default false check (outcome_evaluable = false),
  content_sha256 text not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
  source_graph_sha256 text not null check (source_graph_sha256 ~ '^[0-9a-f]{64}$'),
  published boolean not null default false,
  search_document tsvector generated always as (
    setweight(to_tsvector('english',title),'A') ||
    setweight(to_tsvector('english',tradition_id || ' ' || method_id),'B') ||
    setweight(to_tsvector('english',coalesce(case_data->'interpretation'->>'rule','')),'C')
  ) stored,
  check (jsonb_array_length(field_checks) = total_reference_fields),
  check ((total_reference_fields = 0 and status = 'not-numerically-evaluable')
    or (total_reference_fields > 0 and matched_fields = total_reference_fields and status = 'reference-fields-match')
    or (total_reference_fields > 0 and matched_fields < total_reference_fields and status = 'reference-mismatch'))
);
create index if not exists reading_lab_examples_search_idx on public.reading_lab_examples using gin(search_document);
create index if not exists reading_lab_examples_tradition_idx on public.reading_lab_examples(tradition_id) where published;
alter table public.reading_lab_examples enable row level security;
drop policy if exists reading_lab_published_read on public.reading_lab_examples;
create policy reading_lab_published_read on public.reading_lab_examples for select to anon, authenticated using (published);
revoke all on public.reading_lab_examples from public, anon, authenticated;
grant select on public.reading_lab_examples to anon, authenticated;
grant select, insert, update, delete on public.reading_lab_examples to service_role;

create or replace function public.search_reading_lab_examples(
  query_text text default '', match_count integer default 8, tradition_filter text default null
)
returns table (
  id text, tradition_id text, title text, method_id text, kind text, status text,
  source_ids text[], sources jsonb, case_data jsonb, field_checks jsonb, result_summary jsonb,
  matched_fields integer, total_reference_fields integer, outcome_evaluable boolean,
  content_sha256 text, source_graph_sha256 text, rank real
)
language plpgsql stable security invoker set search_path = '' as $$
declare terms tsquery;
begin
  if query_text is null or length(query_text) > 240 then
    raise exception using errcode = '22023', message = 'Use a query of at most 240 characters'; end if;
  if match_count is null or match_count < 1 or match_count > 24 then
    raise exception using errcode = '22023', message = 'Retrieve 1 to 24 public examples'; end if;
  if tradition_filter is not null and tradition_filter not in ('egyptian','mayan','dee','lilly','vedic','chinese','hebrew','jung','plato') then
    raise exception using errcode = '22023', message = 'Choose a supported tradition ID'; end if;
  terms := pg_catalog.plainto_tsquery('english',query_text);
  if length(pg_catalog.btrim(query_text)) > 0 and pg_catalog.numnode(terms) = 0 then return; end if;
  return query select c.id,c.tradition_id,c.title,c.method_id,c.kind,c.status,c.source_ids,c.sources,
    c.case_data,c.field_checks,c.result_summary,c.matched_fields,c.total_reference_fields,c.outcome_evaluable,
    c.content_sha256,c.source_graph_sha256,pg_catalog.ts_rank_cd(c.search_document,terms,32)::real
    from public.reading_lab_examples c
    where c.published and (tradition_filter is null or c.tradition_id = tradition_filter)
      and (length(pg_catalog.btrim(query_text)) = 0 or c.search_document @@ terms)
    order by pg_catalog.ts_rank_cd(c.search_document,terms,32) desc,c.id
    limit match_count;
end;
$$;
revoke all on function public.search_reading_lab_examples(text,integer,text) from public;
grant execute on function public.search_reading_lab_examples(text,integer,text) to anon, authenticated, service_role;
comment on table public.reading_lab_examples is 'Reviewed public source examples only. No private profiles, model training data or held-out model cases. Listed field matches are not predictive accuracy.';
comment on function public.search_reading_lab_examples(text,integer,text) is 'Bounded published-only invoker lookup. Rank is lexical relevance, not truth or success probability.';
commit;
