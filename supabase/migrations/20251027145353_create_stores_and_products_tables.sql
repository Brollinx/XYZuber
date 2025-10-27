/*
  # Create stores and products tables for XYZ app

  1. New Tables
    - `stores`
      - `id` (uuid, primary key)
      - `name` (text, store name)
      - `latitude` (double precision, store location)
      - `longitude` (double precision, store location)
      - `address` (text, store address)
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key to stores)
      - `name` (text, product name)
      - `price` (numeric, product price)
      - `image_url` (text, product image URL)
      - `description` (text, product description)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (anyone can view stores and products)

  3. Sample Data
    - Insert sample stores and products for testing
*/

CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stores"
  ON stores
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO stores (name, latitude, longitude, address) VALUES
  ('Fresh Market Downtown', 40.7489, -73.9680, '123 Main St, New York, NY'),
  ('Tech Hub Store', 40.7580, -73.9855, '456 5th Ave, New York, NY'),
  ('Green Grocery', 40.7614, -73.9776, '789 Park Ave, New York, NY'),
  ('Urban Outfitters', 40.7505, -73.9934, '321 Broadway, New York, NY'),
  ('Corner Shop', 40.7540, -73.9808, '654 Lexington Ave, New York, NY');

INSERT INTO products (store_id, name, price, image_url, description) VALUES
  ((SELECT id FROM stores WHERE name = 'Fresh Market Downtown'), 'Organic Apples', 4.99, 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg', 'Fresh organic apples'),
  ((SELECT id FROM stores WHERE name = 'Fresh Market Downtown'), 'Fresh Bananas', 2.99, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg', 'Ripe yellow bananas'),
  ((SELECT id FROM stores WHERE name = 'Fresh Market Downtown'), 'Strawberries', 5.99, 'https://images.pexels.com/photos/566888/pexels-photo-566888.jpeg', 'Sweet strawberries'),
  ((SELECT id FROM stores WHERE name = 'Tech Hub Store'), 'Wireless Mouse', 29.99, 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg', 'Ergonomic wireless mouse'),
  ((SELECT id FROM stores WHERE name = 'Tech Hub Store'), 'USB-C Cable', 12.99, 'https://images.pexels.com/photos/4219861/pexels-photo-4219861.jpeg', 'High-speed charging cable'),
  ((SELECT id FROM stores WHERE name = 'Tech Hub Store'), 'Bluetooth Headphones', 79.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 'Noise-cancelling headphones'),
  ((SELECT id FROM stores WHERE name = 'Green Grocery'), 'Organic Tomatoes', 3.99, 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg', 'Fresh vine tomatoes'),
  ((SELECT id FROM stores WHERE name = 'Green Grocery'), 'Mixed Salad', 4.49, 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg', 'Pre-washed salad mix'),
  ((SELECT id FROM stores WHERE name = 'Urban Outfitters'), 'Denim Jacket', 89.99, 'https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg', 'Classic blue denim jacket'),
  ((SELECT id FROM stores WHERE name = 'Urban Outfitters'), 'Canvas Tote Bag', 24.99, 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', 'Eco-friendly tote bag'),
  ((SELECT id FROM stores WHERE name = 'Corner Shop'), 'Coffee Beans', 14.99, 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg', 'Premium arabica beans'),
  ((SELECT id FROM stores WHERE name = 'Corner Shop'), 'Artisan Bread', 6.99, 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', 'Fresh baked sourdough');