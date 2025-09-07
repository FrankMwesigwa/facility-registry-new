-- Create admin_units table with improved structure
CREATE TABLE IF NOT EXISTS admin_units (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    code VARCHAR(50) UNIQUE,  -- Added unique code for each admin unit
    level_id INT NOT NULL REFERENCES levels(id) ON DELETE RESTRICT,
    parent_id INT REFERENCES admin_units(id) ON DELETE RESTRICT,  -- Changed to RESTRICT to prevent orphaned children
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),  -- Added status field
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),  -- Added audit fields
    updated_by INT REFERENCES users(id),
    CONSTRAINT valid_parent_check CHECK (parent_id != id),  -- Prevent self-referencing
    CONSTRAINT name_level_unique UNIQUE (name, level_id)  -- Prevent duplicate names within same level
);

-- Create indexes for better query performance
CREATE INDEX idx_admin_units_level_id ON admin_units(level_id);
CREATE INDEX idx_admin_units_parent_id ON admin_units(parent_id);
CREATE INDEX idx_admin_units_status ON admin_units(status);
CREATE INDEX idx_admin_units_name ON admin_units(name);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_unit_updated_at
    BEFORE UPDATE ON admin_units
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for hierarchical queries
CREATE OR REPLACE VIEW admin_units_hierarchy AS
WITH RECURSIVE unit_tree AS (
    -- Base case: units with no parent
    SELECT 
        id,
        name,
        level_id,
        parent_id,
        ARRAY[id] as path,
        1 as depth,
        name::text as full_path
    FROM admin_units
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive case: units with parent
    SELECT 
        c.id,
        c.name,
        c.level_id,
        c.parent_id,
        p.path || c.id,
        p.depth + 1,
        p.full_path || ' > ' || c.name::text
    FROM admin_units c
    JOIN unit_tree p ON p.id = c.parent_id
)
SELECT * FROM unit_tree;
