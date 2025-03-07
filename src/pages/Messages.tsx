
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Send, User } from "lucide-react";

export default function Messages() {
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const isLandlord = currentUser?.role === 'landlord';

  // Mock data for conversation list
  const conversations = [
    {
      id: 1,
      name: isLandlord ? "John Doe" : "Property Manager",
      lastMessage: "I've submitted a maintenance request",
      timestamp: "10:23 AM",
      unread: true,
      avatar: "JD",
    },
    {
      id: 2,
      name: isLandlord ? "Jane Smith" : "Leasing Office",
      lastMessage: "Thank you for the update",
      timestamp: "Yesterday",
      unread: false,
      avatar: "JS",
    },
    {
      id: 3,
      name: isLandlord ? "Michael Brown" : "Maintenance Team",
      lastMessage: "The repair has been completed",
      timestamp: "May 10",
      unread: false,
      avatar: "MB",
    },
  ];

  // Mock messages for the selected conversation
  const messages = [
    {
      id: 1,
      sender: "them",
      content: "Hello, how can I help you today?",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      sender: "me",
      content: "I'd like to report an issue with my bathroom sink.",
      timestamp: "10:05 AM",
    },
    {
      id: 3,
      sender: "them",
      content: "I'm sorry to hear that. Could you please provide more details about the issue?",
      timestamp: "10:10 AM",
    },
    {
      id: 4,
      sender: "me",
      content: "The faucet is leaking and there seems to be a clog in the drain.",
      timestamp: "10:15 AM",
    },
    {
      id: 5,
      sender: "them",
      content: "Thank you for the details. I'll schedule a maintenance visit for tomorrow morning between 9-11 AM. Does that work for you?",
      timestamp: "10:20 AM",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, this would send the message to the server
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          {isLandlord
            ? "Communicate with your tenants"
            : "Get in touch with your landlord or property management"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <NeumorphicCard className="p-4 overflow-hidden flex flex-col md:col-span-1">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Conversations
          </h2>
          
          <div className="overflow-y-auto flex-1">
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-3 rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${
                    conversation.id === 1 ? "neumorph-inset" : "neumorph hover:bg-accent/10"
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium flex-shrink-0">
                    {conversation.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread && (
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-4 overflow-hidden flex flex-col md:col-span-2">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
              {conversations[0].avatar}
            </div>
            <div>
              <h3 className="font-medium">{conversations[0].name}</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 mb-4">
            <div className="space-y-4">
              {messages.map((msg) => (
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
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="neumorph-input flex-1"
              placeholder="Type a message..."
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="neumorph-button p-2 aspect-square"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </NeumorphicCard>
      </div>
    </DashboardLayout>
  );
}
