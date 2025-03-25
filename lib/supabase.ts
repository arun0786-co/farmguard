import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      farmers: {
        Row: {
          id: string
          name: string
          location: string
          specialties: string[]
          average_output: string
          rating: number
          bio: string
          contact: {
            email: string
            phone: string
            address: string
          }
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['farmers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['farmers']['Insert']>
      }
      products: {
        Row: {
          id: string
          farmer_id: string
          name: string
          description: string
          price: number
          quantity: number
          unit: string
          image_url: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      vendors: {
        Row: {
          id: string
          name: string
          location: string
          specialties: string[]
          rating: number
          bio: string
          contact: {
            email: string
            phone: string
            address: string
          }
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vendors']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vendors']['Insert']>
      }
      orders: {
        Row: {
          id: string
          vendor_id: string
          farmer_id: string
          product_id: string
          quantity: number
          status: 'pending' | 'accepted' | 'rejected' | 'completed'
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
    }
  }
} 