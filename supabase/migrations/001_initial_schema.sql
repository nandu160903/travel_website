-- Horizon Journal — Initial Schema
-- Run in Supabase SQL Editor or via CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE publish_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE story_category AS ENUM (
  'adventures', 'city', 'food', 'culture', 'nature', 'road-trips', 'personal'
);
CREATE TYPE map_location_type AS ENUM ('country', 'city', 'trip', 'story');
CREATE TYPE social_platform AS ENUM ('instagram', 'facebook', 'youtube', 'x', 'threads', 'tiktok');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('creator', 'admin')),
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (single row)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL DEFAULT 'Horizon Journal',
  site_description TEXT,
  bio TEXT,
  profile_photo TEXT,
  hero_image TEXT,
  hero_video TEXT,
  email TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  seo_defaults JSONB DEFAULT '{}'::jsonb,
  featured_destination_ids UUID[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Destinations
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  description TEXT,
  cover_image TEXT,
  coordinates JSONB,
  featured BOOLEAN DEFAULT FALSE,
  story_count INT DEFAULT 0,
  photo_count INT DEFAULT 0,
  status publish_status DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  description TEXT,
  cover_image TEXT,
  coordinates JSONB,
  story_count INT DEFAULT 0,
  photo_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(destination_id, slug)
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  country TEXT NOT NULL,
  cities TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  cover_image TEXT,
  description TEXT,
  category TEXT,
  coordinates JSONB,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  status publish_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  story_count INT DEFAULT 0,
  photo_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  city_name TEXT,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  published_at DATE,
  reading_time INT DEFAULT 5,
  category story_category DEFAULT 'personal',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  status publish_status DEFAULT 'draft',
  gallery TEXT[] DEFAULT '{}',
  video_url TEXT,
  location JSONB,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  location TEXT,
  destination_slug TEXT,
  taken_at DATE,
  camera TEXT,
  width INT,
  height INT,
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  thumbnail TEXT,
  url TEXT NOT NULL,
  embed_url TEXT,
  duration TEXT,
  location TEXT,
  destination_slug TEXT,
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  published_at DATE,
  status publish_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Map locations
CREATE TABLE map_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type map_location_type NOT NULL,
  coordinates JSONB NOT NULL,
  cover_image TEXT,
  description TEXT,
  visit_date DATE,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social links
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform social_platform NOT NULL,
  url TEXT NOT NULL,
  UNIQUE(platform)
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_stories_destination ON stories(destination_id);
CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_trips_slug ON trips(slug);
CREATE INDEX idx_photos_story ON photos(story_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is creator
CREATE OR REPLACE FUNCTION is_creator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('creator', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Public read policies (published content only)
CREATE POLICY "Public read published destinations" ON destinations
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);

CREATE POLICY "Public read published trips" ON trips
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read published stories" ON stories
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read photos" ON photos FOR SELECT USING (true);

CREATE POLICY "Public read published videos" ON videos
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read map locations" ON map_locations FOR SELECT USING (true);

CREATE POLICY "Public read site settings" ON site_settings FOR SELECT USING (true);

CREATE POLICY "Public read social links" ON social_links FOR SELECT USING (true);

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);

-- Creator full access
CREATE POLICY "Creator manage destinations" ON destinations
  FOR ALL USING (is_creator()) WITH CHECK (is_creator());

CREATE POLICY "Creator manage cities" ON cities
  FOR ALL USING (is_creator()) WITH CHECK (is_creator());

CREATE POLICY "Creator manage trips" ON trips
  FOR ALL USING (is_creator()) WITH CHECK (is_creator());

CREATE POLICY "Creator manage stories" ON stories
  FOR ALL USING (is_creator()) WITH CHECK (is_creator());

CREATE POLICY "Creator manage photos" ON photos
  FOR ALL USING (is_creator()) WITH CHECK (is_creator());

CREATE POLICY "Creator manage videos" ON videos
  FOR ALL USING (is_creator()) WITH CHECK (is_creator());

CREATE POLICY "Creator manage map locations" ON map_locations
  FOR ALL USING (is_creator()) WITH CHECK (is_creator());

CREATE POLICY "Creator manage site settings" ON site_settings
  FOR ALL USING (is_creator()) WITH CHECK (is_creator());

CREATE POLICY "Creator manage social links" ON social_links
  FOR ALL USING (is_creator()) WITH CHECK (is_creator());

CREATE POLICY "Creator read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Creator update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Newsletter: public insert only
CREATE POLICY "Public subscribe newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Creator read subscribers" ON newsletter_subscribers
  FOR SELECT USING (is_creator());

-- Storage bucket policies (run after creating 'media' bucket)
-- CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
-- CREATE POLICY "Creator upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND is_creator());
-- CREATE POLICY "Creator delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND is_creator());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'creator');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER destinations_updated_at BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER stories_updated_at BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
