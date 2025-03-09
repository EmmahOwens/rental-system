import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Message = {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  receiver_id: string;
  sender_id: string;
};

export default function Messages() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`receiver_id.eq.${currentUser.id},sender_id.eq.${currentUser.id}`);

        if (error) throw error;

        setMessages(data);
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
  }, [currentUser?.id, toast]);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        messages.map((message) => {
          const profile = message.sender_id === currentUser.id ? message.receiver : message.sender;
          const profileImageUrl = profile?.avatar_url || `/placeholder.svg`;
          const senderName = `${profile?.first_name || ''} ${profile?.last_name || ''}`;

          return (
            <div key={message.id} className="flex items-center mb-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profileImageUrl} alt={senderName} />
                <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-semibold">{senderName}</p>
                <p>{message.content}</p>
                <p className="text-sm text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
