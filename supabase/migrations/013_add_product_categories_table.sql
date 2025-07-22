-- 013_add_product_categories_table.sql
-- Migration: Add product_categories join table for many-to-many product-category relationships

-- 1. Create join table
CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- 2. (Optional) Deprecate the single category column in products (do not drop yet for backward compatibility)
ALTER TABLE products RENAME COLUMN category TO deprecated_category;

-- 3. (Optional) Migrate existing product category data to the join table
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id
FROM products p
JOIN categories c ON p.deprecated_category = c.name;

-- 4. (Optional) Add RLS and policies for product_categories
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product categories are viewable by everyone" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Product categories are manageable by authenticated users" ON product_categories FOR ALL USING (auth.role() = 'authenticated');

-- Down migration
-- To rollback: drop the join table and restore the column name
-- (Note: Data in product_categories will be lost on rollback)
--
-- DROP TABLE IF EXISTS product_categories;
-- ALTER TABLE products RENAME COLUMN deprecated_category TO category; 