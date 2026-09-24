-- Test script to validate RLS policies (run this in Supabase SQL Editor after migrations)

-- Setup: Create test users
-- User 1: regular member
-- User 2: admin

-- Test 1: Member reads own profile (should succeed)
SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "user-1-uuid"}';
SELECT * FROM public.profiles WHERE id = 'user-1-uuid';
-- Expected: Returns own profile

-- Test 2: Member tries to update own role (should fail with trigger error)
UPDATE public.profiles SET role = 'admin' WHERE id = 'user-1-uuid';
-- Expected: ERROR: Only admins can change user roles

-- Test 3: Member reads another member's profile (should fail)
SELECT * FROM public.profiles WHERE id = 'user-2-uuid';
-- Expected: Returns 0 rows (no access)

-- Test 4: Admin reads all profiles (should succeed without recursion)
SET LOCAL "request.jwt.claims" TO '{"sub": "admin-uuid"}';
SELECT * FROM public.profiles;
-- Expected: Returns all profiles, no infinite recursion

-- Test 5: Admin creates announcement (should succeed)
INSERT INTO public.announcements (title, content, author_id)
VALUES ('Test', 'Test content', 'admin-uuid');
-- Expected: SUCCESS

-- Test 6: Anonymous reads weekly_agenda (should succeed)
RESET role;
SELECT * FROM public.weekly_agenda;
-- Expected: Returns all agenda items (public read)

-- Test 7: Anonymous reads events (should succeed)
SELECT * FROM public.events;
-- Expected: Returns all events (public read)

-- Test 8: Anonymous tries to read announcements (should fail)
SELECT * FROM public.announcements;
-- Expected: Returns 0 rows (requires authentication)

-- Test 9: Check is_admin() function works correctly
SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "admin-uuid"}';
SELECT public.is_admin();
-- Expected: true

SET LOCAL "request.jwt.claims" TO '{"sub": "user-1-uuid"}';
SELECT public.is_admin();
-- Expected: false
