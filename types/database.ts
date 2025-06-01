export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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