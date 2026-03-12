-- Ajout de la colonne images pour supporter plusieurs images par produit
alter table public.products 
add column if not exists images jsonb default '[]'::jsonb;

-- Index pour améliorer les performances de recherche
create index if not exists products_images_idx on public.products using gin (images);

-- Commentaire pour documentation
comment on column public.products.images is 'Array of image URLs for product carousel (JSON array)';