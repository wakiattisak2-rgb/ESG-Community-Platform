-- Aetros ESG Platform — Initial Schema
-- Run via Supabase CLI: supabase db push

-- Profiles (extends auth.users in Phase 2)
CREATE TYPE user_role AS ENUM ('member', 'expert', 'moderator', 'admin');
CREATE TYPE post_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE esg_topic AS ENUM ('environment', 'social', 'governance');

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT,
  role user_role NOT NULL DEFAULT 'member',
  xp INTEGER NOT NULL DEFAULT 0,
  carbon_credits INTEGER NOT NULL DEFAULT 50,
  avatar_initials TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  xp_earned INTEGER NOT NULL,
  carbon_credits INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_en TEXT,
  topic esg_topic NOT NULL DEFAULT 'environment',
  status post_status NOT NULL DEFAULT 'pending',
  upvotes INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_key TEXT NOT NULL,
  description_key TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

CREATE TABLE marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_key TEXT NOT NULL,
  description_key TEXT NOT NULL,
  cost INTEGER NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES marketplace_products(id),
  cost INTEGER NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users read all, update own
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = auth_id);

-- Action logs: users manage own
CREATE POLICY "Users can view own action logs"
  ON action_logs FOR SELECT USING (
    user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can insert own action logs"
  ON action_logs FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  );

-- Feed posts: approved visible to all; moderators see pending
CREATE POLICY "Approved posts are public"
  ON feed_posts FOR SELECT USING (
    status = 'approved'
    OR author_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

CREATE POLICY "Authenticated users can create posts"
  ON feed_posts FOR INSERT WITH CHECK (
    author_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  );

CREATE POLICY "Moderators can update post status"
  ON feed_posts FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE auth_id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

-- Challenge participants
CREATE POLICY "Users manage own challenge participation"
  ON challenge_participants FOR ALL USING (
    user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  );

-- Redemptions
CREATE POLICY "Users manage own redemptions"
  ON redemptions FOR ALL USING (
    user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  );
