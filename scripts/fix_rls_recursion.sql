-- Fix for infinite recursion in RLS policies
-- This script disables RLS on the admins table to prevent infinite recursion

-- Disable RLS on admins table
alter table public.admins disable row level security;

-- Drop the problematic policy on admins table
drop policy if exists "Admins can view admins" on public.admins;

-- Recreate the policy with a simpler approach (though RLS is disabled)
-- This is commented out since RLS is disabled
-- create policy "Admins can view admins"
--   on public.admins for select
--   using (true);

-- The fix: since RLS is disabled on admins table, all users can read it
-- This allows the admin check in other policies to work without recursion