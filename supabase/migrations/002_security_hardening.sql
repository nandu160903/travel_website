-- Security hardening (apply in Supabase SQL editor if not using CLI migrate)

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('viewer', 'creator', 'admin'));

-- 1) New signups are not creators by default
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2) Prevent self-service role escalation on profiles
CREATE OR REPLACE FUNCTION prevent_profile_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NEW.role IN ('creator', 'admin') THEN
    IF OLD.role NOT IN ('creator', 'admin') THEN
      RAISE EXCEPTION 'role change not permitted';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_prevent_role_escalation ON profiles;
CREATE TRIGGER profiles_prevent_role_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_profile_role_escalation();

-- 3) Storage (create bucket "media" first in dashboard)
-- Uncomment after bucket exists:
-- CREATE POLICY "Public read media" ON storage.objects
--   FOR SELECT USING (bucket_id = 'media');
-- CREATE POLICY "Creator upload media" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'media' AND is_creator());
-- CREATE POLICY "Creator delete media" ON storage.objects
--   FOR DELETE USING (bucket_id = 'media' AND is_creator());
