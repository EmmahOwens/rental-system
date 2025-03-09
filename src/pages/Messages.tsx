
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Send, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export default function Messages() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const isLandlord = currentUser?.role === 'landlord';

  // Fetch conversations (contacts)
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        
        if (isLandlord) {
          // Landlords see all tenants they communicate with
          const { data, error } = await supabase
            .from('messages')
            .select(`
              sender_id, 
              receiver_id, 
              profiles!sender_id(
                first_name, 
                last_name, 
                avatar_url
              )
            `)
            .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          // Extract unique tenant IDs and their profiles
          const uniqueUsers = new Map();
          
          data.forEach(msg => {
            const contactId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
            if (!uniqueUsers.has(contactId)) {
              const profile = msg.profiles || { first_name: 'Unknown', last_name: 'User' };
              uniqueUsers.set(contactId, {
                id: contactId,
                name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
                avatar: profile.avatar_url || generateInitials(`${profile.first_name || ''} ${profile.last_name || ''}`),
              });
            }
          });
          
          setConversations(Array.from(uniqueUsers.values()));
        } else {
          // Tenants only see their landlord
          // First get the property the tenant lives in
          const { data: tenancies, error: tenancyError } = await supabase
            .from('tenancies')
            .select(`
              property_id, 
              properties(
                landlord_id, 
                profiles!landlord_id(
                  first_name, 
                  last_name, 
                  avatar_url
                )
              )
            `)
            .eq('tenant_id', currentUser.id)
            .eq('active', true)
            .single();
          
          if (tenancyError && tenancyError.code !== 'PGRST116') throw tenancyError;
          
          if (tenancies && tenancies.properties.profiles) {
            const landlord = tenancies.properties.profiles;
            const landlordId = tenancies.properties.landlord_id;
            
            setConversations([{
              id: landlordId,
              name: `${landlord.first_name || ''} ${landlord.last_name || ''}`.trim() || 'Your Landlord',
              avatar: landlord.avatar_url || generateInitials(`${landlord.first_name || ''} ${landlord.last_name || ''}`),
              unread: false // You could calculate this from unread messages
            }]);
          } else {
            toast({
              title: "No active tenancy found",
              description: "You don't appear to have an active lease.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Could not load conversations",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser?.id, isLandlord, toast]);

  // Auto-select first conversation when loaded
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
      fetchMessages(conversations[0].id);
    }
  }, [conversations]);

  // Subscribe to new messages
  useEffect(() => {
    if (!currentUser?.id) return;
    
    const channel = supabase
      .channel('new-messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${currentUser.id}`
        }, 
        (payload) => {
          const newMessage = payload.new;
          
          // If the message is from the currently selected conversation, add it to the messages
          if (selectedConversation && 
              (newMessage.sender_id === selectedConversation.id || 
               newMessage.receiver_id === selectedConversation.id)) {
            setMessages(prevMessages => [...prevMessages, {
              id: newMessage.id,
              sender: newMessage.sender_id === currentUser.id ? 'me' : 'them',
              content: newMessage.content,
              timestamp: formatTimestamp(newMessage.created_at)
            }]);
          }
          
          // Mark the message as read if it's in the current conversation
          if (selectedConversation && 
              newMessage.sender_id === selectedConversation.id) {
            markMessageAsRead(newMessage.id);
          }
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, selectedConversation]);

  // Generate initials for avatar
  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    } else {
      return date.toLocaleDateString();
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (contactId: string) => {
    if (!currentUser?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data.map(msg => ({
        id: msg.id,
        sender: msg.sender_id === currentUser.id ? 'me' : 'them',
        content: msg.content,
        timestamp: formatTimestamp(msg.created_at)
      })));
      
      // Mark unread messages as read
      const unreadMessages = data.filter(msg => 
        !msg.read && msg.receiver_id === currentUser.id);
      
      unreadMessages.forEach(msg => {
        markMessageAsRead(msg.id);
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Could not load messages",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark message as read
  const markMessageAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser?.id || !selectedConversation) return;
    
    try {
      const messageId = uuidv4();
      const newMessage = {
        id: messageId,
        sender_id: currentUser.id,
        receiver_id: selectedConversation.id,
        content: message.trim(),
        read: false,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('messages')
        .insert(newMessage);
      
      if (error) throw error;
      
      // Optimistically add the message to the UI
      setMessages(prevMessages => [...prevMessages, {
        id: messageId,
        sender: 'me',
        content: message.trim(),
        timestamp: formatTimestamp(new Date().toISOString())
      }]);
      
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Handle selecting a conversation
  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          {isLandlord
            ? "Communicate with your tenants"
            : "Get in touch with your landlord"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <NeumorphicCard className="p-4 overflow-hidden flex flex-col md:col-span-1">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {isLandlord ? "Tenants" : "Landlord"}
          </h2>
          
          <div className="overflow-y-auto flex-1">
            <div className="space-y-3">
              {loading && conversations.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {isLandlord ? "No tenants found" : "No landlord found"}
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-3 rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id 
                        ? "neumorph-inset" 
                        : "neumorph hover:bg-accent/10"
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium flex-shrink-0">
                      {typeof conversation.avatar === 'string' && conversation.avatar.length <= 2 
                        ? conversation.avatar 
                        : <User className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage || "Start a conversation"}
                      </p>
                    </div>
                    {conversation.unread && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4 overflow-hidden flex flex-col md:col-span-2">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  {typeof selectedConversation.avatar === 'string' && selectedConversation.avatar.length <= 2 
                    ? selectedConversation.avatar 
                    : <User className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-medium">{selectedConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {isLandlord ? "Tenant" : "Your Landlord"}
                  </p>
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1 mb-4">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${
                          msg.sender === 'me' 
                            ? 'bg-primary text-primary-foreground rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
                            : 'neumorph rounded-tl-xl rounded-tr-xl rounded-br-xl'
                        } p-3`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>{msg.timestamp}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="neumorph-input flex-1"
                  placeholder="Type a message..."
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="neumorph-button p-2 aspect-square"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </NeumorphicCard>
      </div>
    </DashboardLayout>
  );
}
