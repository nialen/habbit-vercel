export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          name: string
          child_name: string
          child_age: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          child_name: string
          child_age: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          child_name?: string
          child_age?: number
          avatar_url?: string | null
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string | null
          body: string | null
          author: string
          inserted_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          body?: string | null
          author: string
          inserted_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          body?: string | null
          author?: string
          inserted_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          body: string | null
          author: string
          inserted_at: string
        }
        Insert: {
          id?: string
          post_id: string
          body?: string | null
          author: string
          inserted_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          body?: string | null
          author?: string
          inserted_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
