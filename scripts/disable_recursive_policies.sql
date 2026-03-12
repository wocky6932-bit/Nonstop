-- Disable RLS completely to fix infinite recursion
-- This removes all policies that reference the admins table

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Only admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Only admins can update products" ON public.products;
DROP POLICY IF EXISTS "Only admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;

-- Drop all policies
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Allow all products operations" ON public.products;
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all orders operations" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow all order items operations" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can view clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can create clients" ON public.clients;

-- Create completely permissive policies that don't reference admins
-- These policies allow all operations without checking the admins table

-- Products: allow all operations
CREATE POLICY "Allow all operations on products"
  ON public.products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Orders: allow all operations  
CREATE POLICY "Allow all operations on orders"
  ON public.orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Order items: allow all operations
CREATE POLICY "Allow all operations on order_items"
  ON public.order_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Clients: allow all operations
CREATE POLICY "Allow all operations on clients"
  ON public.clients
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Note: Since RLS is enabled but with permissive policies,
-- security is handled at the application level via the admin utilities