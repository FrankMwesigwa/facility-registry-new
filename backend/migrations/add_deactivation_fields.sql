-- Migration: Add deactivation_reason and remarks fields to facility_requests table
-- Date: $(date)
-- Description: Add fields to support facility deactivation requests

-- Add deactivation_reason column
ALTER TABLE nhfr.facility_requests 
ADD COLUMN IF NOT EXISTS deactivation_reason VARCHAR(255);

-- Add remarks column  
ALTER TABLE nhfr.facility_requests 
ADD COLUMN IF NOT EXISTS remarks TEXT;

-- Add comment to document the migration
COMMENT ON COLUMN nhfr.facility_requests.deactivation_reason IS 'Reason for facility deactivation request';
COMMENT ON COLUMN nhfr.facility_requests.remarks IS 'Detailed remarks about the deactivation request';
