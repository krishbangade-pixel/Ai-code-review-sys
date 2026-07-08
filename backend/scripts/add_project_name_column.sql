-- Migration: Add project_name column to reviews table
-- This migration adds support for user-friendly project names

-- Add the new column with a default value
ALTER TABLE reviews ADD COLUMN project_name TEXT DEFAULT 'Untitled Review';

-- Create an index for better query performance
CREATE INDEX idx_reviews_project_name ON reviews(project_name);

-- Add a comment to the column
COMMENT ON COLUMN reviews.project_name IS 'User-friendly project name for the review (defaults to "Untitled Review" if not provided)';
