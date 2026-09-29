-- Optional seed data for Supabase
-- Run after 001_initial_schema.sql

INSERT INTO destinations (slug, name, country, region, description, cover_image, coordinates, featured, story_count, photo_count, status)
VALUES
  ('japan', 'Japan', 'Japan', 'East Asia', 'Ancient temples, neon-lit streets, and the quiet poetry of everyday life.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85', '{"lat": 35.6762, "lng": 139.6503}', true, 3, 48, 'published'),
  ('iceland', 'Iceland', 'Iceland', 'Europe', 'Volcanic landscapes, northern lights, and roads that disappear into mist.', 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=85', '{"lat": 64.9631, "lng": -19.0208}', true, 2, 36, 'published'),
  ('bali', 'Bali', 'Indonesia', 'Southeast Asia', 'Rice terraces, ocean temples, and mornings painted in gold.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85', '{"lat": -8.4095, "lng": 115.1889}', true, 2, 42, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO site_settings (site_title, site_description, bio, hero_image, email, social_links)
VALUES (
  'Horizon Journal',
  'Stories, photographs and memories from everywhere the road takes me.',
  'A wanderer with a camera — replace this with your bio.',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2400&q=85',
  'hello@example.com',
  '[{"platform": "instagram", "url": "https://instagram.com/YOUR_USERNAME"}, {"platform": "facebook", "url": "https://facebook.com/YOUR_USERNAME"}]'::jsonb
);
