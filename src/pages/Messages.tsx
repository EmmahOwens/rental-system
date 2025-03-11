import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  user_type: string | null;
  user_id: string;
  phone: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type Message = {
  id: string;
  content: string;
  created_at: string;
  read: boolean | null;
  receiver_id: string;
  sender_id: string;
  sender_first_name?: string | null;
  sender_last_name?: string | null;
  sender_avatar_url?: string | null;
  sender_user_type?: string | null;
  receiver_first_name?: string | null;
  receiver_last_name?: string | null;
  receiver_avatar_url?: string | null;
  receiver_user_type?: string | null;
};

export default function Messages() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [chatPartner, setChatPartner] = useState<Profile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchChatPartner = async () => {
      if (!currentUser?.id) return;
      
      try {
        const targetUserType = currentUser.role === 'tenant' ? 'landlord' : 'tenant';
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_type", targetUserType)
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setChatPartner(data[0]);
        } else {
          toast({
            title: "No chat partner found",
            description: `No ${targetUserType} found to chat with`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error finding chat partner:", error);
        toast({
          title: "Failed to find chat partner",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };
    
    fetchChatPartner();
  }, [currentUser, toast]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser?.id || !chatPartner?.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("messages")
          .select(`
            *,
            profiles_sender:profiles!sender_id(*),
            profiles_receiver:profiles!receiver_id(*)
          `)
          .or(`and(receiver_id.eq.${currentUser.id},sender_id.eq.${chatPartner.id}),and(receiver_id.eq.${chatPartner.id},sender_id.eq.${currentUser.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const transformedMessages = data?.map(msg => ({
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          read: msg.read,
          receiver_id: msg.receiver_id,
          sender_id: msg.sender_id,
          sender_first_name: msg.profiles_sender?.first_name || null,
          sender_last_name: msg.profiles_sender?.last_name || null,
          sender_avatar_url: msg.profiles_sender?.avatar_url || null,
          sender_user_type: msg.profiles_sender?.user_type || null,
          receiver_first_name: msg.profiles_receiver?.first_name || null,
          receiver_last_name: msg.profiles_receiver?.last_name || null,
          receiver_avatar_url: msg.profiles_receiver?.avatar_url || null,
          receiver_user_type: msg.profiles_receiver?.user_type || null,
        })) || [];

        setMessages(transformedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Failed to load messages",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    if (currentUser?.id && chatPartner?.id) {
      const filter = `or(and(receiver_id.eq.${currentUser.id},sender_id.eq.${chatPartner.id}),and(receiver_id.eq.${chatPartner.id},sender_id.eq.${currentUser.id}))`;
      
      const channel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: filter
          },
          (payload) => {
            const fetchNewMessage = async () => {
              const { data, error } = await supabase
                .from("messages")
                .select(`
                  *,
                  profiles_sender:profiles!sender_id(*),
                  profiles_receiver:profiles!receiver_id(*)
                `)
                .eq('id', payload.new.id)
                .single();
                
              if (!error && data) {
                const newMessage = {
                  id: data.id,
                  content: data.content,
                  created_at: data.created_at,
                  read: data.read,
                  receiver_id: data.receiver_id,
                  sender_id: data.sender_id,
                  sender_first_name: data.profiles_sender?.first_name || null,
                  sender_last_name: data.profiles_sender?.last_name || null,
                  sender_avatar_url: data.profiles_sender?.avatar_url || null,
                  sender_user_type: data.profiles_sender?.user_type || null,
                  receiver_first_name: data.profiles_receiver?.first_name || null,
                  receiver_last_name: data.profiles_receiver?.last_name || null,
                  receiver_avatar_url: data.profiles_receiver?.avatar_url || null,
                  receiver_user_type: data.profiles_receiver?.user_type || null,
                };
                
                setMessages(prev => [...prev, newMessage]);
                scrollToBottom();
              }
            };
            
            fetchNewMessage();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser?.id, chatPartner?.id, toast]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!messageContent.trim() || !currentUser?.id || !chatPartner?.id) return;
    
    setSendingMessage(true);
    try {
      const newMessage = {
        content: messageContent.trim(),
        sender_id: currentUser.id,
        receiver_id: chatPartner.id,
        read: false
      };
      
      const { error } = await supabase
        .from("messages")
        .insert(newMessage);
        
      if (error) throw error;
      
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!currentUser?.id || messages.length === 0) return;
      
      const unreadMessageIds = messages
        .filter(msg => msg.receiver_id === currentUser.id && !msg.read)
        .map(msg => msg.id);
        
      if (unreadMessageIds.length === 0) return;
      
      try {
        const { error } = await supabase
          .from("messages")
          .update({ read: true })
          .in('id', unreadMessageIds);
          
        if (error) throw error;
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };
    
    markMessagesAsRead();
  }, [messages, currentUser?.id]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chatPartner) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-bold mb-4">No Chat Partner Available</h1>
        <p>There are no {currentUser?.role === 'tenant' ? 'landlords' : 'tenants'} available to chat with.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-150px)]">
      <div className="flex items-center p-3 md:p-4 border-b">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 mr-2 md:mr-3">
          <AvatarImage src={chatPartner.avatar_url || `/placeholder.svg`} />
          <AvatarFallback>
            {chatPartner.first_name?.charAt(0) || chatPartner.user_type?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-base md:text-lg font-semibold">
            {chatPartner.first_name && chatPartner.last_name 
              ? `${chatPartner.first_name} ${chatPartner.last_name}` 
              : `${chatPartner.user_type?.charAt(0).toUpperCase()}${chatPartner.user_type?.slice(1) || 'User'}`}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground capitalize">{chatPartner.user_type || 'User'}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-xs md:text-sm">Start the conversation by sending a message</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUserSender = message.sender_id === currentUser?.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-[90%] md:max-w-[80%] p-2 md:p-3 text-sm md:text-base ${isCurrentUserSender ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="break-words">{message.content}</p>
                  <p className={`text-[10px] md:text-xs mt-1 ${isCurrentUserSender ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isCurrentUserSender && message.read && ' • Read'}
                  </p>
                </Card>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 md:p-4 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            disabled={sendingMessage}
            className="flex-1 text-sm md:text-base h-9 md:h-10"
          />
          <Button 
            type="submit" 
            disabled={!messageContent.trim() || sendingMessage}
            size={isMobile ? "sm" : "icon"}
            className="h-9 md:h-10"
          >
            {sendingMessage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
