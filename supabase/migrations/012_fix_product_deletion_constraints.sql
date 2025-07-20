-- Fix foreign key constraints for product deletion
-- This migration adds CASCADE deletion to allow products to be deleted
-- even when they have related order_items

-- First, drop the existing foreign key constraint
ALTER TABLE order_items 
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Recreate the foreign key constraint with CASCADE DELETE
ALTER TABLE order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;

-- Also ensure product_colors and product_sizes have CASCADE DELETE
ALTER TABLE product_colors 
DROP CONSTRAINT IF EXISTS product_colors_product_id_fkey;

ALTER TABLE product_colors 
ADD CONSTRAINT product_colors_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;

ALTER TABLE product_sizes 
DROP CONSTRAINT IF EXISTS product_sizes_product_id_fkey;

ALTER TABLE product_sizes 
ADD CONSTRAINT product_sizes_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;

-- Add comment to document the change
COMMENT ON CONSTRAINT order_items_product_id_fkey ON order_items IS 'CASCADE DELETE: When a product is deleted, all related order items are automatically deleted';
COMMENT ON CONSTRAINT product_colors_product_id_fkey ON product_colors IS 'CASCADE DELETE: When a product is deleted, all related product colors are automatically deleted';
COMMENT ON CONSTRAINT product_sizes_product_id_fkey ON product_sizes IS 'CASCADE DELETE: When a product is deleted, all related product sizes are automatically deleted'; 