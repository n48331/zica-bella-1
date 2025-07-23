-- 014_add_orders_user_id_foreign_key.sql
-- Add foreign key from orders.user_id to user_profiles.id for Supabase join support

ALTER TABLE orders
ADD CONSTRAINT orders_user_id_fkey
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE; 