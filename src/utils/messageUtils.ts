
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './profileUtils';

export interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  receiver_id: string;
  sender_id: string;
  sender?: Profile;
  receiver?: Profile;
  new?: boolean;
}

export interface MessageInput {
  content: string;
  sender_id: string;
  receiver_id: string;
}

/**
 * Send a message
 */
export async function sendMessage(messageData: MessageInput) {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
    .single();
  
  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  
  return data as Message;
}

/**
 * Fetch messages between two users
 */
export async function getMessages(user1Id: string, user2Id: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
    .or(`and(sender_id.eq.${user1Id},receiver_id.eq.${user2Id}),and(sender_id.eq.${user2Id},receiver_id.eq.${user1Id})`)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  return data as Message[];
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(messageId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);
  
  if (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
  
  return true;
}

/**
 * Mark all messages as read for a receiver
 */
export async function markMessagesAsRead(connectionId: string, receiverId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('receiver_id', receiverId)
    .eq('connection_id', connectionId)
    .eq('read', false);
  
  if (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
  
  return true;
}

/**
 * Subscribe to new messages
 */
export function subscribeToMessages(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `receiver_id=eq.${userId}`,
    }, payload => {
      callback(payload);
    })
    .subscribe();
}
