-- Migration complète pour ajouter toutes les colonnes manquantes à la table products
-- Exécutez ce script dans Supabase SQL Editor

-- Ajouter la colonne images (si elle n'existe pas)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- Ajouter la colonne category (si elle n'existe pas)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';

-- Ajouter la colonne description (si elle n'existe pas)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_images ON public.products USING GIN (images);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- Mettre à jour les produits existants pour avoir une image par défaut dans le tableau images
UPDATE public.products 
SET images = jsonb_build_array(image::text) 
WHERE images = '[]'::jsonb OR images IS NULL;

-- Mettre à jour les produits existants pour avoir une catégorie par défaut
UPDATE public.products 
SET category = 'general' 
WHERE category IS NULL OR category = '';

-- Ajouter des commentaires pour la documentation
COMMENT ON COLUMN public.products.images IS 'JSON array of image URLs for this product. First image is typically the main product image.';
COMMENT ON COLUMN public.products.category IS 'Product category for filtering and organization (e.g., clothing, accessories, etc.)';
COMMENT ON COLUMN public.products.description IS 'Detailed description of the product.';

-- Message de confirmation
SELECT 'Migration completed successfully!' as status;