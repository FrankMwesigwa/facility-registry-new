-- Migration script to update timestamp columns to match Sequelize defaults
-- Run this script to rename created_at/updated_at to createdAt/updatedAt

-- Update admin_levels table
ALTER TABLE admin_levels RENAME COLUMN created_at TO "createdAt";
ALTER TABLE admin_levels RENAME COLUMN updated_at TO "updatedAt";

-- Update admin_units table  
ALTER TABLE admin_units RENAME COLUMN created_at TO "createdAt";
ALTER TABLE admin_units RENAME COLUMN updated_at TO "updatedAt";

-- Update any other tables that might have the same issue
-- (Add more ALTER statements here for other tables as needed)

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('admin_levels', 'admin_units') 
AND column_name IN ('createdAt', 'updatedAt', 'created_at', 'updated_at')
ORDER BY table_name, column_name;
