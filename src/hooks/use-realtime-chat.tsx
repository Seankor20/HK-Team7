'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState, useMemo, use } from 'react'
import { useSupabase } from '@/lib/supabase-context'

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
  displayName?: string
}

const EVENT_MESSAGE_TYPE = 'message'

export function useRealtimeChat({ roomId, userId }: UseRealtimeChatProps) {
  const supabase = useSupabase();
  const [messages, setMessages] = useState([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  // Generate a random display name for this user (per session)
  const displayName = useMemo(() => {
    // e.g. User1234
    return 'User' + Math.floor(1000 + Math.random() * 9000)
  }, [])

  // Load existing messages from database (no user info join)
  useEffect(() => {
    const loadMessages = async () => {
      if (!roomId) return
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('Messages')
          .select('id, content, user_room_id, created_at, participant:RoomParticipants!user_room_id(id, roomId, userId)')
          .eq('participant.roomId', roomId)
          .order('created_at', { ascending: true })
        if (error) {
          console.error('Error loading messages:', error)
          return
        }
        // Flatten for UI: attach displayName for current user, else show as 'Anonymous'
        setMessages((data || []).map((msg) => {
          const participant = Array.isArray(msg.participant) ? msg.participant[0] : msg.participant;
          return {
            id: msg.id,
            content: msg.content,
            userId: participant?.userId,
            roomId: participant?.roomId,
            created_at: msg.created_at,
            displayName: participant?.userId === userId ? displayName : 'Anonymous',
          }
        }))
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMessages()
  }, [roomId, supabase, userId, displayName])

  useEffect(() => {
    if (!roomId) {
      console.log('No room ID provided')
      return
    }
        

    const newChannel = supabase.channel(`room:${roomId}`)
    console.log('Subscribing to channel:', newChannel)
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
        // Check if participant exists
        let { data: participantData, error: participantError } = await supabase
          .from('RoomParticipants')
          .select('*')
          .eq('roomId', roomId)
          .eq('userId', userId)
          .single()
        // If not, insert participant
        if (participantError || !participantData) {
          const { data: newParticipant, error: insertError } = await supabase
            .from('RoomParticipants')
            .insert({ roomId, userId })
            .select('*')
            .single()
          if (insertError) {
            console.error('Error adding participant:', insertError)
            throw insertError
          }
          participantData = newParticipant
        }


        // Save message to database (no user info join)
        const { data: inserted, error } = await supabase
          .from('Messages')
          .insert({
            content: content.trim(),
            created_at: new Date().toISOString(),
            user_room_id: participantData.id,
          })
          .select('id, content, created_at, user_room_id, participant:RoomParticipants!user_room_id(id, roomId, userId)')
          .single()

        if (error) {
          console.error('Error saving message to database:', error)
          throw error
        }

        // Flatten the message for UI
        const participant = Array.isArray(inserted.participant) ? inserted.participant[0] : inserted.participant;
        const message = {
          id: inserted.id,
          content: inserted.content,
          userId: participant?.userId,
          roomId: participant?.roomId,
          created_at: inserted.created_at,
          displayName,
        }

        setMessages((current) => [...current, message])

        // Update room's last_message
        await supabase
          .from('ChatRooms')
          .update({
            last_message: content.trim()
          })
          .eq('id', roomId)

        // Broadcast message to real-time channel
        const broadcastResult = await channel.send({
          type: 'broadcast',
          event: EVENT_MESSAGE_TYPE,
          payload: message
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
