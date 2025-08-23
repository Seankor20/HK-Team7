import { supabase } from './supabase'
import type { Database } from './supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type Question = Database['public']['Tables']['question']['Row']
type Quiz = Database['public']['Tables']['quizzes']['Row']
type ChatMessage = Database['public']['Tables']['chat_messages']['Row']

// Question Services
export const questionService = {
  async getAllQuestions(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('question')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching questions:', error)
      return []
    }
    
    return data || []
  },

  async getQuestionsByCategory(category?: string): Promise<Question[]> {
    let query = supabase
      .from('question')
      .select('*')
      .order('id', { ascending: true })
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching questions by category:', error)
      return []
    }
    
    return data || []
  },

  async getRandomQuestions(limit: number = 5): Promise<Question[]> {
    // First get all questions, then shuffle them in JavaScript
    const { data, error } = await supabase
      .from('question')
      .select('*')
    
    if (error) {
      console.error('Error fetching questions:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      return []
    }
    
    // Shuffle the questions and take the first 'limit' items
    const shuffled = [...data].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, limit)
  }
}

// Profile Services
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    
    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating profile:', error)
      return null
    }
    
    return data
  },

  async createProfile(userId: string, email: string, fullName: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating profile:', error)
      return null
    }
    
    return data
  }
}

// Quiz Services
export const quizService = {
  async saveQuizResult(userId: string, score: number, totalQuestions: number): Promise<Quiz | null> {
    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        user_id: userId,
        score,
        total_questions: totalQuestions,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error saving quiz result:', error)
      return null
    }
    
    return data
  },

  async getUserQuizHistory(userId: string): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching quiz history:', error)
      return []
    }
    
    return data || []
  },

  async getLeaderboard(): Promise<Array<Quiz & { profiles: Profile }>> {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .order('score', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
    
    return data || []
  }
}

// Chat Services
export const chatService = {
  async saveChatMessage(userId: string, message: string, response: string): Promise<ChatMessage | null> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message,
        response,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error saving chat message:', error)
      return null
    }
    
    return data
  },

  async getUserChatHistory(userId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) {
      console.error('Error fetching chat message:', error)
      return []
    }
    
    return data || []
  }
}
