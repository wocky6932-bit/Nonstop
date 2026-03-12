-- Insérer des produits de test avec des prix pour tester la conversion de devises
INSERT INTO products (name, price, currency, image, sold_out, description) VALUES
('T-Shirt Nonstop', 15000, 'XOF', '/images/img-6725.jpeg', false, 'T-shirt en coton premium avec logo Nonstop'),
('Hoodie Premium', 25000, 'XOF', '/images/img-6726.jpeg', false, 'Hoodie avec capuche et logo brodé'),
('Casquette Logo', 8000, 'XOF', '/images/img-6727.jpeg', false, 'Casquette ajustable avec logo Nonstop'),
('Tote Bag', 5000, 'XOF', '/images/img-6728.jpeg', false, 'Sac en toile avec logo Nonstop'),
('Polo Premium', 18000, 'XOF', '/images/img-6729.jpeg', false, 'Polo en coton premium')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  image = EXCLUDED.image,
  sold_out = EXCLUDED.sold_out,
  description = EXCLUDED.description;