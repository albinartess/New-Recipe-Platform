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
      recipes: {
        Row: {
          id: string
          title: string
          description: string
          ingredients: Json
          instructions: string[]
          cooking_time: number
          servings: number
          difficulty: 'easy' | 'medium' | 'hard'
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          ingredients: Json
          instructions: string[]
          cooking_time: number
          servings: number
          difficulty: 'easy' | 'medium' | 'hard'
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          ingredients?: Json
          instructions?: string[]
          cooking_time?: number
          servings?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      recipe_categories: {
        Row: {
          recipe_id: string
          category_id: string
        }
        Insert: {
          recipe_id: string
          category_id: string
        }
        Update: {
          recipe_id?: string
          category_id?: string
        }
      }
      recipe_tags: {
        Row: {
          recipe_id: string
          tag_id: string
        }
        Insert: {
          recipe_id: string
          tag_id: string
        }
        Update: {
          recipe_id?: string
          tag_id?: string
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