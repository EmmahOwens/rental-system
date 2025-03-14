import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, getMessages, sendMessage, subscribeToMessages, markMessagesAsRead } from "@/utils/messageUtils";
import { getTenantLandlord, getLandlordTenants } from "@/utils/profileUtils";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connectionId || !profile) return;

    const fetchMessages = async () => {
      const fetchedMessages = await getMessages(connectionId);
      setMessages(fetchedMessages);
      await markMessagesAsRead(connectionId, profile.id);
    };

    fetchMessages();

    const subscription = subscribeToMessages(connectionId, (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.sender_id !== profile.id) {
        markMessagesAsRead(connectionId, profile.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [connectionId, profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    setLoading(true);
    try {
      await sendMessage(connectionId, profile.id, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
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
            {messages.map((message) => (
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
            ))}
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