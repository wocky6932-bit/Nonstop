-- Temporary fix: Disable RLS on all tables to resolve recursion issues

-- Disable RLS on all tables
alter table public.clients disable row level security;
alter table public.products disable row level security;
alter table public.orders disable row level security;
alter table public.order_items disable row level security;

-- Drop all existing policies to clear any recursion
drop policy if exists "Anyone can view products" on public.products;
drop policy if exists "Admin can insert products" on public.products;
drop policy if exists "Admin can update products" on public.products;
drop policy if exists "Admin can delete products" on public.products;

drop policy if exists "Anyone can create clients" on public.clients;
drop policy if exists "Anyone can view clients" on public.clients;

drop policy if exists "Anyone can create orders" on public.orders;
drop policy if exists "Anyone can view orders" on public.orders;
drop policy if exists "Admin can update orders" on public.orders;

drop policy if exists "Anyone can create order items" on public.order_items;
drop policy if exists "Anyone can view order items" on public.order_items;

-- Enable RLS again without problematic policies
alter table public.clients enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Simple policies without recursion
create policy "Allow all operations on clients"
  on public.clients for all
  using (true)
  with check (true);

create policy "Allow all operations on products"
  on public.products for all
  using (true)
  with check (true);

create policy "Allow all operations on orders"
  on public.orders for all
  using (true)
  with check (true);

create policy "Allow all operations on order_items"
  on public.order_items for all
  using (true)
  with check (true);