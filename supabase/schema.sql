-- Enable UUID extension
create extension if not exists "pgcrypto";

-- site_settings
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  "whatsappNumber" text not null,
  "updatedAt" timestamp with time zone not null default now()
);

-- developers
create table developers (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  "logoUrl" text,
  website text,
  established integer,
  "createdAt" timestamp with time zone default now() not null,
  "updatedAt" timestamp with time zone default now() not null
);

-- projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  "developerId" uuid references developers(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  location text not null,
  city text not null,
  locality text,
  description text,
  amenities text,
  latitude double precision,
  longitude double precision,
  "createdAt" timestamp with time zone default now() not null,
  "updatedAt" timestamp with time zone default now() not null
);

-- project_images
create table project_images (
  id uuid primary key default gen_random_uuid(),
  "projectId" uuid references projects(id) on delete cascade not null,
  url text not null,
  label text,
  "sortOrder" integer default 0 not null,
  "createdAt" timestamp with time zone default now() not null
);

-- configurations
create table configurations (
  id uuid primary key default gen_random_uuid(),
  "projectId" uuid references projects(id) on delete cascade not null,
  bhk integer not null,
  "variantName" text not null,
  "carpetArea" double precision not null,
  "pricePerSqft" double precision not null,
  status text not null,
  "possessionDate" timestamp with time zone,
  "reraId" text,
  "createdAt" timestamp with time zone default now() not null,
  "updatedAt" timestamp with time zone default now() not null
);

-- floor_plans
create table floor_plans (
  id uuid primary key default gen_random_uuid(),
  "configurationId" uuid references configurations(id) on delete cascade not null,
  type text not null,
  label text not null,
  url text not null,
  "sortOrder" integer default 0 not null,
  "createdAt" timestamp with time zone default now() not null
);

-- inventory
create table inventory (
  id uuid primary key default gen_random_uuid(),
  "configurationId" uuid references configurations(id) on delete cascade not null,
  "unitNumber" text not null,
  floor integer not null,
  facing text,
  "priceOverride" double precision,
  status text default 'AVAILABLE' not null,
  notes text,
  "createdAt" timestamp with time zone default now() not null,
  "updatedAt" timestamp with time zone default now() not null,
  unique ("configurationId", "unitNumber")
);

-- ENABLE ROW LEVEL SECURITY
alter table site_settings enable row level security;
alter table developers enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table configurations enable row level security;
alter table floor_plans enable row level security;
alter table inventory enable row level security;

-- PUBLIC READ POLICIES
create policy "Public read access for site_settings" on site_settings for select using (true);
create policy "Public read access for developers" on developers for select using (true);
create policy "Public read access for projects" on projects for select using (true);
create policy "Public read access for project_images" on project_images for select using (true);
create policy "Public read access for configurations" on configurations for select using (true);
create policy "Public read access for floor_plans" on floor_plans for select using (true);
create policy "Public read access for inventory" on inventory for select using (true);

-- AUTHENTICATED WRITE POLICIES
create policy "Authenticated full access for site_settings" on site_settings for all to authenticated using (true) with check (true);
create policy "Authenticated full access for developers" on developers for all to authenticated using (true) with check (true);
create policy "Authenticated full access for projects" on projects for all to authenticated using (true) with check (true);
create policy "Authenticated full access for project_images" on project_images for all to authenticated using (true) with check (true);
create policy "Authenticated full access for configurations" on configurations for all to authenticated using (true) with check (true);
create policy "Authenticated full access for floor_plans" on floor_plans for all to authenticated using (true) with check (true);
create policy "Authenticated full access for inventory" on inventory for all to authenticated using (true) with check (true);

-- STORAGE BUCKET CREATION (run in Supabase SQL editor)
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true) on conflict do nothing;

create policy "Public read access for uploads bucket" on storage.objects for select using (bucket_id = 'uploads');
create policy "Authenticated write access for uploads bucket" on storage.objects for insert to authenticated with check (bucket_id = 'uploads');
create policy "Authenticated update access for uploads bucket" on storage.objects for update to authenticated using (bucket_id = 'uploads');
create policy "Authenticated delete access for uploads bucket" on storage.objects for delete to authenticated using (bucket_id = 'uploads');

