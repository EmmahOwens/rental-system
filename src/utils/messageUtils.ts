
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './profileUtils';

export interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  receiver_id: string;
  sender_id: string;
  connection_id?: string;
  sender?: Profile;
  receiver?: Profile;
  new?: boolean;
}

export interface MessageInput {
  content: string;
  sender_id: string;
  receiver_id: string;
  connection_id?: string;
}

/**
 * Send a message
 */
export async function sendMessage(messageData: MessageInput) {
  try {
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
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}

/**
 * Fetch messages between two users
 */
export async function getMessages(user1Id: string, user2Id: string) {
  try {
    // Try to find a connection between the users
    const { data: connection, error: connectionError } = await supabase
      .from('tenant_landlord_connections')
      .select('id')
      .or(`tenant_id.eq.${user1Id},landlord_id.eq.${user1Id}`)
      .or(`tenant_id.eq.${user2Id},landlord_id.eq.${user2Id}`)
      .maybeSingle();
    
    if (connectionError || !connection) {
      console.error('Error finding connection:', connectionError);
      // Fallback to the old method if no connection is found
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
    
    // If we found a connection, use it to fetch messages
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
      .eq('connection_id', connection.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    
    return data as Message[];
  } catch (error) {
    console.error('Error in getMessages:', error);
    return [];
  }
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(messageId: string) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);
    
    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markMessageAsRead:', error);
    throw error;
  }
}

/**
 * Mark all messages as read for a receiver in a connection
 */
export async function markMessagesAsRead(connectionId: string, receiverId: string) {
  try {
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
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    throw error;
  }
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

/**
 * Get unread message count for a connection
 */
export async function getUnreadMessageCount(connectionId: string, userId: string) {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('connection_id', connectionId)
      .eq('receiver_id', userId)
      .eq('read', false);
    
    if (error) {
      console.error('Error getting unread message count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getUnreadMessageCount:', error);
    return 0;
  }
}

/**
 * Update unread count in connection
 */
export async function updateConnectionUnreadCount(connectionId: string, count: number) {
  try {
    const { error } = await supabase
      .from('tenant_landlord_connections')
      .update({ unread_count: count })
      .eq('id', connectionId);
    
    if (error) {
      console.error('Error updating connection unread count:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateConnectionUnreadCount:', error);
    throw error;
  }
}
