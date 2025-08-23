import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

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
      quiz: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          due_date: string
          status: 'pending' | 'in-progress' | 'completed' | 'overdue'
          type: 'quiz' | 'homework' // To distinguish between quiz and homework
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          due_date: string
          status?: 'pending' | 'in-progress' | 'completed' | 'overdue'
          type: 'quiz' | 'homework'
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          due_date?: string
          status?: 'pending' | 'in-progress' | 'completed' | 'overdue'
          type?: 'quiz' | 'homework'
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
