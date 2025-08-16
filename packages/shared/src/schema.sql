-- Create profiles table
CREATE TABLE public.profiles (
    address text PRIMARY KEY,
    ens_name text,
    github_handle text,
    blog_url text,
    bio text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create reputation_scores table
CREATE TABLE public.reputation_scores (
    address text PRIMARY KEY REFERENCES public.profiles(address),
    total_score integer DEFAULT 0,
    github_score integer DEFAULT 0,
    blog_score integer DEFAULT 0,
    certificate_score integer DEFAULT 0,
    last_updated timestamptz DEFAULT now()
);

-- Create leaderboard_cache table
CREATE TABLE public.leaderboard_cache (
    rank integer,
    address text REFERENCES public.profiles(address),
    total_score integer,
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (rank)
);

-- Create events table for analytics
CREATE TABLE public.events (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    address text REFERENCES public.profiles(address),
    event_type text NOT NULL,
    artifact_type text,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reputation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE USING (
        auth.uid()::text = address
    );

-- Reputation scores policies
CREATE POLICY "Scores are viewable by everyone"
    ON public.reputation_scores
    FOR SELECT USING (true);

-- Leaderboard cache policies
CREATE POLICY "Leaderboard is viewable by everyone"
    ON public.leaderboard_cache
    FOR SELECT USING (true);

-- Events policies
CREATE POLICY "Events are viewable by everyone"
    ON public.events
    FOR SELECT USING (true);

-- Create indexes
CREATE INDEX reputation_scores_total_score_idx ON public.reputation_scores(total_score DESC);
CREATE INDEX events_address_type_idx ON public.events(address, event_type);
CREATE INDEX events_created_at_idx ON public.events(created_at DESC);

-- Create function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Clear existing leaderboard
    DELETE FROM public.leaderboard_cache;
    
    -- Insert new rankings
    INSERT INTO public.leaderboard_cache (rank, address, total_score)
    SELECT 
        ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank,
        address,
        total_score
    FROM public.reputation_scores
    WHERE total_score > 0
    ORDER BY total_score DESC
    LIMIT 100;
END;
$$;
