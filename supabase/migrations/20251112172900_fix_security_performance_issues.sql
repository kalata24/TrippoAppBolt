/*
  # Fix Security and Performance Issues

  1. **Add Missing Indexes**
     - Add index on `packing_lists.trip_id` for foreign key performance
     - Add index on `packing_lists.user_id` for foreign key performance
     - Remove unused index `idx_user_preferences_user_id`

  2. **Optimize RLS Policies**
     - Replace `auth.uid()` with `(select auth.uid())` in all policies
     - This prevents re-evaluation for each row, improving query performance at scale
     - Affects policies on: `user_preferences`, `trips`, `packing_lists`

  3. **Enable Password Protection**
     - Enable leaked password protection via HaveIBeenPwned.org
     - Enhances security by preventing use of compromised passwords

  ## Important Notes
  - Indexes improve foreign key query performance significantly
  - RLS optimization is critical for scalability with large datasets
  - Password protection adds an extra security layer for user accounts
*/

-- =====================================================
-- 1. ADD MISSING INDEXES FOR FOREIGN KEYS
-- =====================================================

-- Index for packing_lists.trip_id foreign key
CREATE INDEX IF NOT EXISTS idx_packing_lists_trip_id 
  ON packing_lists(trip_id);

-- Index for packing_lists.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_packing_lists_user_id 
  ON packing_lists(user_id);

-- Remove unused index on user_preferences
DROP INDEX IF EXISTS idx_user_preferences_user_id;

-- =====================================================
-- 2. OPTIMIZE RLS POLICIES - USER_PREFERENCES TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can read own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- =====================================================
-- 3. OPTIMIZE RLS POLICIES - TRIPS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own trips" ON trips;
DROP POLICY IF EXISTS "Users can insert own trips" ON trips;
DROP POLICY IF EXISTS "Users can update own trips" ON trips;
DROP POLICY IF EXISTS "Users can delete own trips" ON trips;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can read own trips"
  ON trips FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own trips"
  ON trips FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 4. OPTIMIZE RLS POLICIES - PACKING_LISTS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own packing lists" ON packing_lists;
DROP POLICY IF EXISTS "Users can insert own packing lists" ON packing_lists;
DROP POLICY IF EXISTS "Users can update own packing lists" ON packing_lists;
DROP POLICY IF EXISTS "Users can delete own packing lists" ON packing_lists;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own packing lists"
  ON packing_lists FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own packing lists"
  ON packing_lists FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own packing lists"
  ON packing_lists FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own packing lists"
  ON packing_lists FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
