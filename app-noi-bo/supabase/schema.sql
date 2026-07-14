-- Portfolio Production internal app schema
-- Run this in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

-- ========== Shared enums ==========

create type package_type as enum ('PDF', 'Landing Page', 'Combo');

create type customer_status as enum (
  'Moi lien he',
  'Dang lam',
  'Cho khach duyet',
  'Da giao',
  'Da thanh toan',
  'Huy'
);

create type node_type as enum (
  'customer_info',
  'experience',
  'theme',
  'design_request',
  'content_review',
  'product'
);

create type node_status as enum ('idle', 'running', 'done', 'error', 'waiting_review');

-- ========== Part 1: Customer management ==========

create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  industry text,
  source text,
  package package_type,
  status customer_status not null default 'Moi lien he',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_status_idx on customers (status);
create index customers_package_idx on customers (package);

-- ========== Part 2: Project canvas ==========

create table projects (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers (id) on delete set null,
  name text not null,
  package package_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_customer_id_idx on projects (customer_id);

create table canvas_nodes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  node_type node_type not null,
  position_x double precision not null default 0,
  position_y double precision not null default 0,
  input_data jsonb not null default '{}'::jsonb,
  output_data jsonb not null default '{}'::jsonb,
  status node_status not null default 'idle',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index canvas_nodes_project_id_idx on canvas_nodes (project_id);

create table canvas_edges (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  source_node_id uuid not null references canvas_nodes (id) on delete cascade,
  target_node_id uuid not null references canvas_nodes (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index canvas_edges_project_id_idx on canvas_edges (project_id);
create index canvas_edges_source_idx on canvas_edges (source_node_id);
create index canvas_edges_target_idx on canvas_edges (target_node_id);

-- ========== updated_at triggers ==========

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger customers_set_updated_at
  before update on customers
  for each row execute function set_updated_at();

create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

create trigger canvas_nodes_set_updated_at
  before update on canvas_nodes
  for each row execute function set_updated_at();

-- ========== Row Level Security ==========
-- Single shared workspace: any authenticated user can read/write everything.
-- No public (anon) access at all.

alter table customers enable row level security;
alter table projects enable row level security;
alter table canvas_nodes enable row level security;
alter table canvas_edges enable row level security;

create policy "authenticated_full_access" on customers
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on projects
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on canvas_nodes
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on canvas_edges
  for all to authenticated using (true) with check (true);
