import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export const sendMessage = async (
  connectionId: string, 
  senderId: string, 
  content: string
): Promise<Message | null> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        connection_id: connectionId,
        sender_id: senderId,
        content,
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error sending message:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return null;
  }
};

export const getMessages = async (connectionId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:profiles(id, first_name, last_name, avatar_url)
      `)
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: true });
      
    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getMessages:", error);
    return [];
  }
};

export const subscribeToMessages = (
  connectionId: string,
  callback: (message: Message) => void
) => {
  return supabase
    .channel(`messages:${connectionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `connection_id=eq.${connectionId}`
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
};

export const markMessagesAsRead = async (
  connectionId: string,
  recipientId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("connection_id", connectionId)
      .neq("sender_id", recipientId)
      .eq("is_read", false);
      
    if (error) {
      console.error("Error marking messages as read:", error);
    }
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error);
  }
};