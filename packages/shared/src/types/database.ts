export interface Profile {
  address: string;
  ens_name: string | null;
  github_handle: string | null;
  blog_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReputationScore {
  address: string;
  total_score: number;
  github_score: number;
  blog_score: number;
  certificate_score: number;
  last_updated: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  total_score: number;
  updated_at: string;
}

export interface Event {
  id: string;
  address: string;
  event_type: 'artifact_submitted' | 'artifact_verified' | 'sbt_minted' | 'profile_updated';
  artifact_type: 'github' | 'blog' | 'certificate' | null;
  metadata: Record<string, any>;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'address' | 'created_at' | 'updated_at'>>;
      };
      reputation_scores: {
        Row: ReputationScore;
        Insert: Omit<ReputationScore, 'last_updated'>;
        Update: Partial<Omit<ReputationScore, 'address' | 'last_updated'>>;
      };
      leaderboard_cache: {
        Row: LeaderboardEntry;
        Insert: Omit<LeaderboardEntry, 'updated_at'>;
        Update: never; // Read-only table
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at'>;
        Update: never; // Events are immutable
      };
    };
    Functions: {
      update_leaderboard: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
  };
};
