'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'

interface UseRealtimeChatProps {
  roomId: string
  userId: string
}

export interface ChatMessage {
  id: string
  content: string
  userId: string
  roomId: string
  created_at: string
  user?: {
    id: string
    name: string
    role: string
    school: string
  }
}

const EVENT_MESSAGE_TYPE = 'message'

export function useRealtimeChat({ roomId, userId }: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load existing messages from database
  useEffect(() => {
    const loadMessages = async () => {
      if (!roomId) return
      
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('Messages')
          .select(`
            *,
            participant:RoomParticipants!user_room_id(
              id,
              roomId,
              userId,
              user:user(id, raw_user_meta_data)
            )
          `)
          .eq('participant.roomId', roomId)  // Filter by room ID from RoomParticipant   // Filter by user ID from RoomParticipant
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error loading messages:', error)
          return
        }
        
        setMessages(data || [])
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [roomId, supabase])

  useEffect(() => {
    if (!roomId) return

    const newChannel = supabase.channel(`room:${roomId}`)

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        console.log('Received broadcast message:', payload)
        setMessages((current) => [...current, payload.payload as ChatMessage])
      })
      .subscribe(async (status) => {
        console.log('Channel status:', status)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        }
      })

    setChannel(newChannel)

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel)
      }
    }
  }, [roomId, supabase])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected || !content.trim() || !roomId || !userId) {
        console.log('Cannot send message:', { channel: !!channel, isConnected, content: content.trim(), roomId, userId })
        return
      }

      try {
        console.log('Sending message:', content)
        
        // First, save message to database
        const { data, error } = await supabase
          .from('messages')
          .insert({
            content: content.trim(),
            roomId: roomId,
            userId: userId,
            created_at: new Date().toISOString()
          })
          .select(`
            *,
            user:user(id, name, role, school)
          `)
          .single()

        if (error) {
          console.error('Error saving message to database:', error)
          throw error
        }

        console.log('Message saved to database:', data)

        // Update local state immediately
        setMessages((current) => [...current, data])

        // Update room's last_message
        await supabase
          .from('chatRooms')
          .update({
            last_message: content.trim()
          })
          .eq('id', roomId)

        // Broadcast message to real-time channel
        const broadcastResult = await channel.send({
          type: 'broadcast',
          event: EVENT_MESSAGE_TYPE,
          payload: data
        })

        console.log('Broadcast result:', broadcastResult)

      } catch (error) {
        console.error('Error sending message:', error)
      }
    },
    [channel, isConnected, roomId, userId, supabase]
  )

  return { messages, sendMessage, isConnected, loading }
}
