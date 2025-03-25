-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create tables
create table public.farmers (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    location text not null,
    specialties text[] not null,
    average_output text not null,
    rating float not null default 0,
    bio text,
    contact jsonb not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.products (
    id uuid default uuid_generate_v4() primary key,
    farmer_id uuid references public.farmers(id) on delete cascade not null,
    name text not null,
    description text,
    price decimal(10,2) not null,
    quantity integer not null,
    unit text not null,
    image_url text,
    category text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.vendors (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    location text not null,
    specialties text[] not null,
    rating float not null default 0,
    bio text,
    contact jsonb not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.orders (
    id uuid default uuid_generate_v4() primary key,
    vendor_id uuid references public.vendors(id) on delete cascade not null,
    farmer_id uuid references public.farmers(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    quantity integer not null,
    status text not null check (status in ('pending', 'accepted', 'rejected', 'completed')),
    total_amount decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index products_farmer_id_idx on public.products(farmer_id);
create index orders_vendor_id_idx on public.orders(vendor_id);
create index orders_farmer_id_idx on public.orders(farmer_id);
create index orders_product_id_idx on public.orders(product_id);

-- Create updated_at triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_farmers_updated_at
    before update on public.farmers
    for each row
    execute function public.handle_updated_at();

create trigger handle_products_updated_at
    before update on public.products
    for each row
    execute function public.handle_updated_at();

create trigger handle_vendors_updated_at
    before update on public.vendors
    for each row
    execute function public.handle_updated_at();

create trigger handle_orders_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at();

-- Set up Row Level Security (RLS)
alter table public.farmers enable row level security;
alter table public.products enable row level security;
alter table public.vendors enable row level security;
alter table public.orders enable row level security;

-- Create policies
create policy "Farmers are viewable by everyone"
    on public.farmers for select
    using (true);

create policy "Products are viewable by everyone"
    on public.products for select
    using (true);

create policy "Vendors are viewable by everyone"
    on public.vendors for select
    using (true);

create policy "Orders are viewable by involved parties"
    on public.orders for select
    using (
        auth.uid() in (
            select id from public.farmers where id = farmer_id
            union
            select id from public.vendors where id = vendor_id
        )
    ); 