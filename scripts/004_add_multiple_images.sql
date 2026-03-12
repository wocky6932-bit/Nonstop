-- Migration: Add support for multiple images per product
-- Add images column as JSON array to store multiple image URLs
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- Update existing products to have their image as the first image in the array
-- This preserves existing data while adding new functionality
UPDATE public.products 
SET images = jsonb_build_array(image::text) 
WHERE images = '[]'::jsonb OR images IS NULL;

-- Create index for better performance on image queries
CREATE INDEX IF NOT EXISTS idx_products_images ON public.products USING GIN (images);

-- Update RLS policies to include the new images column (not needed since policies use SELECT *)
-- The existing policies will work fine with the new column

-- Add comment for documentation
COMMENT ON COLUMN public.products.images IS 'JSON array of image URLs for this product. First image is typically the main product image.';

-- Optional: If you want to ensure data integrity, you could add a constraint
-- But for flexibility during migration, we'll skip this for now
-- ALTER TABLE public.products ADD CONSTRAINT check_images_non_empty CHECK (jsonb_array_length(images) > 0);