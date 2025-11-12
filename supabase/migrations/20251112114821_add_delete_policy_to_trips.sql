/*
  # Add Delete Policy for Trips

  1. Security
    - Add RLS policy allowing users to delete their own trips
    - Policy checks that auth.uid() matches the trip's user_id
    - Ensures users can only delete trips they created
*/

CREATE POLICY "Users can delete own trips"
  ON trips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
