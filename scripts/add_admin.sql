-- Script pour ajouter l'administrateur dans la base de données
-- À exécuter dans l'éditeur SQL de Supabase (SQL Editor)

-- 1. D'abord, désactiver temporairement les politiques RLS pour éviter la récursion
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- 2. Ajouter l'administrateur
INSERT INTO public.admins (email) 
VALUES ('adminnonstop@gmail.com');

-- 3. Réactiver les politiques RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Vérifier que l'administrateur a été ajouté
SELECT * FROM public.admins WHERE email = 'adminnonstop@gmail.com';