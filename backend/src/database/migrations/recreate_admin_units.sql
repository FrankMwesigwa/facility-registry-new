-- Drop existing admin_units table and related objects
DROP VIEW IF EXISTS nhfr.admin_units_hierarchy CASCADE;
DROP TABLE IF EXISTS nhfr.admin_units CASCADE;

-- Create admin_levels table if it doesn't exist
CREATE TABLE IF NOT EXISTS nhfr.admin_levels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level_number INTEGER NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_units table with proper foreign key constraints
CREATE TABLE nhfr.admin_units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    level_id INTEGER NOT NULL REFERENCES nhfr.admin_levels(id) ON DELETE RESTRICT,
    parent_id INTEGER REFERENCES nhfr.admin_units(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    CONSTRAINT valid_parent_check CHECK (parent_id != id),
    CONSTRAINT name_level_unique UNIQUE (name, level_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_admin_units_level_id ON nhfr.admin_units(level_id);
CREATE INDEX idx_admin_units_parent_id ON nhfr.admin_units(parent_id);
CREATE INDEX idx_admin_units_name ON nhfr.admin_units(name);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_unit_updated_at
    BEFORE UPDATE ON nhfr.admin_units
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for hierarchical queries
CREATE OR REPLACE VIEW nhfr.admin_units_hierarchy AS
WITH RECURSIVE unit_tree AS (
    -- Base case: units with no parent
    SELECT 
        au.id,
        au.name,
        au.level_id,
        au.parent_id,
        al.name as level_name,
        al.level_number,
        ARRAY[au.id] as path,
        1 as depth,
        au.name::text as full_path
    FROM nhfr.admin_units au
    JOIN nhfr.admin_levels al ON au.level_id = al.id
    WHERE au.parent_id IS NULL

    UNION ALL

    -- Recursive case: units with parent
    SELECT 
        c.id,
        c.name,
        c.level_id,
        c.parent_id,
        al.name as level_name,
        al.level_number,
        p.path || c.id,
        p.depth + 1,
        p.full_path || ' > ' || c.name::text
    FROM nhfr.admin_units c
    JOIN nhfr.admin_levels al ON c.level_id = al.id
    JOIN unit_tree p ON p.id = c.parent_id
    WHERE 1=1
)
SELECT * FROM unit_tree;

-- Insert default admin levels if they don't exist
INSERT INTO nhfr.admin_levels (name, level_number, description) VALUES
    ('Country', 1, 'National level'),
    ('Region', 2, 'Regional level'),
    ('District', 3, 'District level'),
    ('County', 4, 'County level'),
    ('Sub-county', 5, 'Sub-county level'),
    ('Parish', 6, 'Parish level'),
    ('Village', 7, 'Village level')
ON CONFLICT (level_number) DO NOTHING;
