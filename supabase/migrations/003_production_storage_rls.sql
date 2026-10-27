-- Production storage buckets + tightened public read policies.
-- Create buckets in Supabase Dashboard (or CLI) before relying on storage policies:
--   travel-public  — public bucket, published media
--   travel-private — private bucket, draft media
-- Optional legacy bucket: media (if you already use it, keep policies below)

-- ---------------------------------------------------------------------------
-- Tighter public SELECT on content tables
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Public read photos" ON photos;
CREATE POLICY "Public read photos for published content" ON photos
  FOR SELECT USING (
    (
      story_id IS NULL
      AND trip_id IS NULL
    )
    OR EXISTS (
      SELECT 1 FROM stories s
      WHERE s.id = photos.story_id AND s.status = 'published'
    )
    OR EXISTS (
      SELECT 1 FROM trips t
      WHERE t.id = photos.trip_id AND t.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Public read cities" ON cities;
CREATE POLICY "Public read cities of published destinations" ON cities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM destinations d
      WHERE d.id = cities.destination_id AND d.status = 'published'
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: travel-public (public read, creators write via is_creator())
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Public read travel-public" ON storage.objects;
CREATE POLICY "Public read travel-public" ON storage.objects
  FOR SELECT USING (bucket_id = 'travel-public');

DROP POLICY IF EXISTS "Creator insert travel-public" ON storage.objects;
CREATE POLICY "Creator insert travel-public" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'travel-public' AND is_creator());

DROP POLICY IF EXISTS "Creator update travel-public" ON storage.objects;
CREATE POLICY "Creator update travel-public" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'travel-public' AND is_creator())
  WITH CHECK (bucket_id = 'travel-public' AND is_creator());

DROP POLICY IF EXISTS "Creator delete travel-public" ON storage.objects;
CREATE POLICY "Creator delete travel-public" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'travel-public' AND is_creator());

-- ---------------------------------------------------------------------------
-- Storage: travel-private (no public read; creators only)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Creator read travel-private" ON storage.objects;
CREATE POLICY "Creator read travel-private" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'travel-private' AND is_creator());

DROP POLICY IF EXISTS "Creator insert travel-private" ON storage.objects;
CREATE POLICY "Creator insert travel-private" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'travel-private' AND is_creator());

DROP POLICY IF EXISTS "Creator update travel-private" ON storage.objects;
CREATE POLICY "Creator update travel-private" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'travel-private' AND is_creator())
  WITH CHECK (bucket_id = 'travel-private' AND is_creator());

DROP POLICY IF EXISTS "Creator delete travel-private" ON storage.objects;
CREATE POLICY "Creator delete travel-private" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'travel-private' AND is_creator());

-- ---------------------------------------------------------------------------
-- Legacy "media" bucket (backward compatible with existing uploads)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Creator upload media" ON storage.objects;
CREATE POLICY "Creator upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND is_creator());

DROP POLICY IF EXISTS "Creator delete media" ON storage.objects;
CREATE POLICY "Creator delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND is_creator());

DROP POLICY IF EXISTS "Creator update media" ON storage.objects;
CREATE POLICY "Creator update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND is_creator())
  WITH CHECK (bucket_id = 'media' AND is_creator());
