
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Message, 
  getMessages, 
  sendMessage, 
  subscribeToMessages, 
  markMessagesAsRead,
  updateConnectionUnreadCount
} from "@/utils/messageUtils";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  connectionId: string;
  otherUser: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export function ChatInterface({ connectionId, otherUser }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connectionId || !profile) return;

    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages(profile.id, otherUser.id);
        setMessages(fetchedMessages);
        await markMessagesAsRead(connectionId, profile.id);
        await updateConnectionUnreadCount(connectionId, 0);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error loading messages",
          description: "There was a problem loading your messages",
          variant: "destructive",
        });
      }
    };

    fetchMessages();

    const subscription = subscribeToMessages(profile.id, (payload) => {
      const newMessage = payload.new;
      
      // Only add the message if it's for this connection
      if (newMessage.connection_id === connectionId) {
        setMessages((prev) => [...prev, {
          ...newMessage,
          sender: newMessage.sender_id === profile.id ? profile : otherUser,
          receiver: newMessage.receiver_id === profile.id ? profile : otherUser
        }]);
      }
      
      if (newMessage.sender_id !== profile.id && newMessage.connection_id === connectionId) {
        markMessagesAsRead(connectionId, profile.id);
        updateConnectionUnreadCount(connectionId, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [connectionId, profile, otherUser.id, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    setLoading(true);
    try {
      await sendMessage({
        content: newMessage.trim(),
        sender_id: profile.id,
        receiver_id: otherUser.id,
        connection_id: connectionId
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Message not sent",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={otherUser.avatar_url} />
            <AvatarFallback>{getInitials(otherUser.first_name, otherUser.last_name)}</AvatarFallback>
          </Avatar>
          <span>{otherUser.first_name} {otherUser.last_name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === profile?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.sender_id === profile?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !newMessage.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
