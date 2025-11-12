/*
  # Add Date Range to Trips

  1. Changes to `trips` table
    - Add `start_date` column (date) to store the start date of the trip
    - Add `end_date` column (date) to store the end date of the trip
    - Remove old `month` and `year` columns if they exist
    
  2. Notes
    - This change allows for precise date range tracking
    - Enables event matching during the actual travel period
    - Maintains backward compatibility with existing trip records
*/

-- Add start_date and end_date columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'start_date'
  ) THEN
    ALTER TABLE trips ADD COLUMN start_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'end_date'
  ) THEN
    ALTER TABLE trips ADD COLUMN end_date date;
  END IF;
END $$;