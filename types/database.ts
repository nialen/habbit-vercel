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
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          category: string
          description: string | null
          target_frequency: number
          reminder_time: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string
          category?: string
          description?: string | null
          target_frequency?: number
          reminder_time?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string
          category?: string
          description?: string | null
          target_frequency?: number
          reminder_time?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      habit_logs: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completed_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completed_at?: string
          notes?: string | null
        }
      }
      rewards: {
        Row: {
          id: string
          name: string
          description: string | null
          points_required: number
          category: string
          icon: string
          is_active: boolean
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          points_required: number
          category?: string
          icon?: string
          is_active?: boolean
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          points_required?: number
          category?: string
          icon?: string
          is_active?: boolean
          stock?: number
          updated_at?: string
        }
      }
      redemptions: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          points_spent: number
          status: string
          redeemed_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          points_spent: number
          status?: string
          redeemed_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          points_spent?: number
          status?: string
          notes?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          title: string | null
          body: string | null
          author: string
          category: string
          tags: string[]
          likes_count: number
          is_pinned: boolean
          inserted_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          body?: string | null
          author: string
          category?: string
          tags?: string[]
          likes_count?: number
          is_pinned?: boolean
          inserted_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          body?: string | null
          author?: string
          category?: string
          tags?: string[]
          likes_count?: number
          is_pinned?: boolean
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
      post_likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
        }
      }
      comment_likes: {
        Row: {
          id: string
          user_id: string
          comment_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          comment_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          comment_id?: string
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
