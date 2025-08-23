import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these from Supabase)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          role?: 'student' | 'teacher' | 'ngo' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          role?: 'student' | 'teacher' | 'ngo' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          role?: 'student' | 'teacher' | 'ngo' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      question: {
        Row: {
          id: string
          question: string
          option: string[]
          correct_answer: number
          explanation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          option: string[]
          correct_answer: number
          explanation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          option?: string[]
          correct_answer?: number
          explanation?: string | null
          created_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          user_id: string
          score: number
          total_questions: number
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          total_questions: number
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          total_questions?: number
          completed_at?: string
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string
          created_at?: string
        }
      }
      homework: {
        Row: {
          id: string
          created_at: string
          title: string
          due_date: string
          status: 'pending' | 'in-progress' | 'completed' | 'overdue'
          description: string
          quiz_id?: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          due_date: string
          status?: 'pending' | 'in-progress' | 'completed' | 'overdue'
          description: string
          quiz_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          due_date?: string
          status?: 'pending' | 'in-progress' | 'completed' | 'overdue'
          description?: string
          quiz_id?: string
        }
      }
      completed_materials: {
        Row: {
          id: string
          title: string
          type: string
          difficulty: string
          estimated_time: number
          xp_reward: number
          icon: string
          color: string
          category: string
          completed_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          type: string
          difficulty: string
          estimated_time: number
          xp_reward: number
          icon: string
          color: string
          category: string
          completed_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          difficulty?: string
          estimated_time?: number
          xp_reward?: number
          icon?: string
          color?: string
          category?: string
          completed_at?: string
          user_id?: string
        }
      }
    }
  }
}
