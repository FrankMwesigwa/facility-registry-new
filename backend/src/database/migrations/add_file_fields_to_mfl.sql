-- Migration to add operating_license and district_letter columns to nhfr.mfl table

ALTER TABLE nhfr.mfl
ADD COLUMN IF NOT EXISTS operating_license VARCHAR(255),
ADD COLUMN IF NOT EXISTS district_letter VARCHAR(255);
