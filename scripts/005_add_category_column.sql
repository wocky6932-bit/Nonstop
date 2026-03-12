-- Migration: Add category column to products table
-- This resolves the "Could not find the 'category' column of 'products' in the schema cache" error

-- Add category column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';

-- Create index for better performance on category queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- Add comment for documentation
COMMENT ON COLUMN public.products.category IS 'Product category for filtering and organization (e.g., clothing, accessories, etc.)';

-- Update existing products to have a default category
-- This ensures all existing products have a category value
UPDATE public.products SET category = 'general' WHERE category IS NULL OR category = '';

-- Optional: Add a check constraint to ensure category is not empty
-- Uncomment if you want to enforce non-empty categories
-- ALTER TABLE public.products ADD CONSTRAINT check_category_not_empty CHECK (category IS NOT NULL AND category != '');