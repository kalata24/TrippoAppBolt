/*
  # Add Trip Status and Packing Lists

  1. Changes to `trips` table
    - Add `title` column for custom trip names (nullable, defaults to generic name)
    - Add `status` column (upcoming, completed) - defaults to 'upcoming'
    - Add `is_favorite` column (boolean) - defaults to false
    - Add `is_saved` column (boolean) - defaults to false
    
  2. New Tables
    - `packing_lists`
      - `id` (uuid, primary key)
      - `trip_id` (uuid, foreign key to trips)
      - `user_id` (uuid, foreign key to auth.users)
      - `items` (jsonb array of packing items)
      - `created_at` (timestamp)
      
  3. Security
    - Enable RLS on `packing_lists` table
    - Add policies for authenticated users to manage their own packing lists
    - Update trips policies if needed
*/

-- Add new columns to trips table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'title'
  ) THEN
    ALTER TABLE trips ADD COLUMN title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'status'
  ) THEN
    ALTER TABLE trips ADD COLUMN status text DEFAULT 'upcoming';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'is_favorite'
  ) THEN
    ALTER TABLE trips ADD COLUMN is_favorite boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'is_saved'
  ) THEN
    ALTER TABLE trips ADD COLUMN is_saved boolean DEFAULT false;
  END IF;
END $$;

-- Create packing_lists table
CREATE TABLE IF NOT EXISTS packing_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on packing_lists
ALTER TABLE packing_lists ENABLE ROW LEVEL SECURITY;

-- Policies for packing_lists
CREATE POLICY "Users can view own packing lists"
  ON packing_lists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own packing lists"
  ON packing_lists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own packing lists"
  ON packing_lists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own packing lists"
  ON packing_lists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);