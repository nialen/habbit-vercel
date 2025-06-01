-- Create posts table
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text,
  body text,
  author uuid references auth.users on delete cascade,
  inserted_at timestamptz default now()
);

-- Create comments table
create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.posts on delete cascade,
  body text,
  author uuid references auth.users on delete cascade,
  inserted_at timestamptz default now()
);

-- Enable RLS
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- Create policies
create policy "Users can read all posts" on public.posts
  for select using (true);

create policy "Authenticated users can create posts" on public.posts
  for insert with check (auth.uid() = author);

create policy "Users can update their own posts" on public.posts
  for update using (auth.uid() = author);

create policy "Users can delete their own posts" on public.posts
  for delete using (auth.uid() = author);

create policy "Users can read all comments" on public.comments
  for select using (true);

create policy "Authenticated users can create comments" on public.comments
  for insert with check (auth.uid() = author);

create policy "Users can update their own comments" on public.comments
  for update using (auth.uid() = author);

create policy "Users can delete their own comments" on public.comments
  for delete using (auth.uid() = author); 