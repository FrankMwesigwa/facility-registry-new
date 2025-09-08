CREATE TABLE IF NOT EXISTS admin_levels (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL UNIQUE,
code TEXT UNIQUE,
level_number INTEGER NOT NULL UNIQUE CHECK (level_number > 0),
"createdAt" TIMESTAMPTZ DEFAULT NOW(),
"updatedAt" TIMESTAMPTZ DEFAULT NOW()
);


-- Optional convenience index
CREATE INDEX IF NOT EXISTS idx_admin_levels_level_number ON admin_levels(level_number);


-- 02_units.sql
CREATE TABLE IF NOT EXISTS admin_units (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
code TEXT UNIQUE,
level_id INTEGER NOT NULL REFERENCES admin_levels(id) ON UPDATE CASCADE ON DELETE RESTRICT,
parent_id INTEGER REFERENCES admin_units(id) ON UPDATE CASCADE ON DELETE RESTRICT,
-- materialized path (e.g., "/1/8/42/") for quick subtree reads (kept by API)
path TEXT,
"createdAt" TIMESTAMPTZ DEFAULT NOW(),
"updatedAt" TIMESTAMPTZ DEFAULT NOW()
);


CREATE INDEX IF NOT EXISTS idx_admin_units_level_id ON admin_units(level_id);
CREATE INDEX IF NOT EXISTS idx_admin_units_parent_id ON admin_units(parent_id);
CREATE INDEX IF NOT EXISTS idx_admin_units_path ON admin_units USING GIN (to_tsvector('simple', path));



INSERT INTO nhfr.admin_units (name, parent_id, level_id, "createdAt", "updatedAt")
SELECT DISTINCT
  region AS name,
  1 AS parent_id,
  2 AS level_id,
  NOW() AS "createdAt",
  NOW() AS "updatedAt"
FROM nhfr.facilityuploads
ORDER BY region;


--- Sub county Dynamic Script ---
WITH districts AS (
  SELECT id AS parent_id, name AS district_name
  FROM nhfr.admin_units
  WHERE level_id = 3  -- District/City/Municipality
),
pairs AS (
  SELECT DISTINCT
         f.district   AS district_name,
         f.subcounty  AS subcounty_name
  FROM nhfr.facilityuploads f
  WHERE f.subcounty IS NOT NULL AND f.subcounty <> ''
),
to_insert AS (
  SELECT d.parent_id, p.subcounty_name
  FROM pairs p
  JOIN districts d
    -- match by district using case/space-insensitive comparison ONLY in the join
    ON lower(btrim(d.district_name)) = lower(btrim(p.district_name))
)
INSERT INTO nhfr.admin_units (name, parent_id, level_id, "createdAt", "updatedAt")
SELECT t.subcounty_name, t.parent_id, 4, NOW(), NOW()
FROM to_insert t
LEFT JOIN nhfr.admin_units u
  ON u.level_id = 4
 AND u.parent_id = t.parent_id
 AND lower(btrim(u.name)) = lower(btrim(t.subcounty_name))  -- dup check only
WHERE u.id IS NULL;


---- Add Facilities ----
WITH regions AS (
  SELECT id AS region_id, name AS region_name
  FROM nhfr.admin_units
  WHERE level_id = 2
),
districts AS (
  SELECT d.id AS district_id, d.name AS district_name, d.parent_id AS region_id
  FROM nhfr.admin_units d
  WHERE d.level_id = 3
),
subcounties AS (
  SELECT s.id AS subcounty_id, s.name AS subcounty_name, s.parent_id AS district_id
  FROM nhfr.admin_units s
  WHERE s.level_id = 4
),
src AS (
  SELECT DISTINCT
    f.region     AS region_name,
    f.district   AS district_name,
    f.subcounty  AS subcounty_name,
    f.shortname  AS facility_name
  FROM nhfr.facilityuploads f
  WHERE f.region    IS NOT NULL
    AND f.district  IS NOT NULL
    AND f.subcounty IS NOT NULL
    AND f.shortname IS NOT NULL
    AND f.shortname <> ''
),
linked AS (
  SELECT sc.subcounty_id, s.facility_name
  FROM src s
  JOIN regions   r  ON lower(btrim(r.region_name))   = lower(btrim(s.region_name))
  JOIN districts d  ON d.region_id = r.region_id
                    AND lower(btrim(d.district_name)) = lower(btrim(s.district_name))
  JOIN subcounties sc ON sc.district_id = d.district_id
                     AND lower(btrim(sc.subcounty_name)) = lower(btrim(s.subcounty_name))
)
INSERT INTO nhfr.admin_units (name, parent_id, level_id, "createdAt", "updatedAt")
SELECT l.facility_name, l.subcounty_id, 5, NOW(), NOW()
FROM linked l
LEFT JOIN nhfr.admin_units u
  ON u.level_id = 5
 AND u.parent_id = l.subcounty_id
 AND lower(btrim(u.name)) = lower(btrim(l.facility_name))
WHERE u.id IS NULL;

--- View Script ---
create view nhfr.facility_hierarchy as
SELECT
f.id                AS facility_id,
f.name              AS facility,
sc.id               AS subcounty_id,
sc.name             AS subcounty,
d.id                AS district_id,
d.name              AS district,
r.id                AS region_id,
r.name              AS region
FROM nhfr.admin_units AS f         -- level 5
inner JOIN nhfr.admin_units AS sc   -- level 4
ON sc.id = f.parent_id AND sc.level_id = 4
inner JOIN nhfr.admin_units AS d    -- level 3
ON d.id = sc.parent_id AND d.level_id = 3
inner JOIN nhfr.admin_units AS r    -- level 2
ON r.id = d.parent_id AND r.level_id = 2
ORDER BY r.name, d.name, sc.name , f.name;


----- Join Scripts ----
-- 1) Drop if rebuilding
DROP TABLE IF EXISTS nhfr.facility_uploads_enriched;

-- 2) Create-and-fill from join (CTAS)
CREATE TABLE nhfr.mfl AS
SELECT
  f.uid,
  f."name",
  f.shortname,
  f."Longtitude",
  f."Latitude",
  f.nhfrid,
  f.subcounty_uid,
  f.subcounty,
  f.district_uid,
  f.district,
  f.region,
  f.hflevel,
  f.ownership,
  f.authority,
  f.status,
  f.report,
  h.facility_id,
  h.subcounty_id,
  h.district_id,
  h.region_id
FROM nhfr.facilityuploads f
LEFT JOIN nhfr.facility_hierarchy h
  ON lower(btrim(f.shortname))  = lower(btrim(h.facility))
 AND lower(btrim(f.subcounty))  = lower(btrim(h.subcounty))
 AND lower(btrim(f.district))   = lower(btrim(h.district))
 AND lower(btrim(f.region))     = lower(btrim(h.region))
ORDER BY f.subcounty, f.district, f.shortname;

-- 3) (Recommended) add indexes
CREATE UNIQUE INDEX IF NOT EXISTS ux_fac_up_enriched_uid
  ON nhfr.facility_uploads_enriched (uid);

CREATE INDEX IF NOT EXISTS ix_fac_up_enriched_ids
  ON nhfr.facility_uploads_enriched (region_id, district_id, subcounty_id, facility_id);
