-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  user_id uuid references auth.users(id) default auth.uid(),
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(768) -- 768 is the dimension size for Gemini text-embedding-004
);

-- Enable RLS
alter table documents enable row level security;

-- Policies
create policy "Users can view their own documents"
  on documents for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own documents"
  on documents for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own documents"
  on documents for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own documents"
  on documents for delete
  using ( auth.uid() = user_id );

-- Create a function to search for documents
create or replace function public.match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_conversation_id text default null,
  filter_user_id uuid default null
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
set search_path = public, pg_temp
as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.documents as d
  where (1 - (d.embedding <=> query_embedding) > match_threshold)
    and (filter_conversation_id is null or (d.metadata->>'conversationId') = filter_conversation_id)
    and (filter_user_id is null or d.user_id = filter_user_id)
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;
