
import React, { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, Search, Users, Phone, Video } from "lucide-react";
import { getTenantLandlords, getLandlordTenants, Profile, TenantWithConnection } from "@/utils/profileUtils";
import { getMessages, markMessageAsRead, subscribeToMessages, sendMessage } from "@/utils/messageUtils";

interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  receiver_id: string;
  sender_id: string;
  sender: Profile;
  receiver: Profile;
}

export default function Messages() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<TenantWithConnection[]>([]);
  const [selectedContact, setSelectedContact] = useState<TenantWithConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLandlord = currentUser?.role === 'landlord';

  // Fetch contacts based on user role
  useEffect(() => {
    async function loadContacts() {
      if (!currentUser?.id) return;
      
      try {
        setIsLoading(true);
        let loadedContacts: TenantWithConnection[] = [];
        
        if (isLandlord) {
          // Landlords see their tenants
          loadedContacts = await getLandlordTenants(currentUser.id);
        } else {
          // Tenants see their landlords
          loadedContacts = await getTenantLandlords(currentUser.id);
        }
        
        setContacts(loadedContacts);
        
        // Auto-select first contact if available
        if (loadedContacts.length > 0 && !selectedContact) {
          setSelectedContact(loadedContacts[0]);
        }
      } catch (error) {
        console.error("Error loading contacts:", error);
        toast({
          title: "Failed to load contacts",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadContacts();
  }, [currentUser, isLandlord, toast, selectedContact]);

  // Load messages when selected contact changes
  useEffect(() => {
    async function loadMessages() {
      if (!currentUser?.id || !selectedContact?.id) return;
      
      try {
        const loadedMessages = await getMessages(currentUser.id, selectedContact.id);
        setMessages(loadedMessages);
        
        // Mark unread messages as read
        const unreadMessages = loadedMessages.filter(
          (msg) => !msg.read && msg.sender_id === selectedContact.id
        );
        
        for (const msg of unreadMessages) {
          await markMessageAsRead(msg.id);
        }
        
        // Update unread count for the selected contact
        if (unreadMessages.length > 0) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.id === selectedContact.id
                ? { ...contact, unread_count: 0 }
                : contact
            )
          );
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Failed to load messages",
          description: "Please refresh and try again",
          variant: "destructive",
        });
      }
    }
    
    loadMessages();
  }, [currentUser, selectedContact, toast]);

  // Subscribe to new messages
  useEffect(() => {
    if (!currentUser?.id) return;
    
    const subscription = subscribeToMessages(currentUser.id, (payload: any) => {
      const newMessage = payload.new;
      
      // Add the new message to the message list if it belongs to the current conversation
      if (
        selectedContact &&
        ((newMessage.sender_id === currentUser.id && newMessage.receiver_id === selectedContact.id) ||
          (newMessage.sender_id === selectedContact.id && newMessage.receiver_id === currentUser.id))
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessage,
            sender: newMessage.sender_id === currentUser.id ? currentUser : selectedContact,
            receiver: newMessage.receiver_id === currentUser.id ? currentUser : selectedContact,
          },
        ]);
        
        // Mark message as read if received
        if (newMessage.sender_id === selectedContact.id) {
          markMessageAsRead(newMessage.id);
        }
      } else if (newMessage.receiver_id === currentUser.id) {
        // Update unread count for the contact
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === newMessage.sender_id
              ? {
                  ...contact,
                  unread_count: (contact.unread_count || 0) + 1,
                }
              : contact
          )
        );
        
        // Show toast for new message if not in the current conversation
        toast({
          title: "New message",
          description: `You have a new message from ${
            contacts.find((c) => c.id === newMessage.sender_id)?.first_name || "someone"
          }`,
        });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser, selectedContact, contacts, toast]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser?.id || !selectedContact?.id) return;
    
    try {
      setIsSending(true);
      await sendMessage({
        content: newMessage.trim(),
        sender_id: currentUser.id,
        receiver_id: selectedContact.id,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem-2.5rem)]">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <MessageSquare className="mr-2 h-7 w-7 text-primary" /> 
            Messages
          </h1>
        </div>

        <div className="flex flex-1 gap-6 h-full overflow-hidden">
          {/* Contacts Sidebar */}
          <div className="w-full md:w-80 flex flex-col h-full overflow-hidden">
            <NeumorphicCard className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 neumorph-input"
                />
              </div>
            </NeumorphicCard>
            
            <div className="flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center p-6">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium mb-1">No contacts found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? "Try a different search term" : "You don't have any contacts yet"}
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                      selectedContact?.id === contact.id
                        ? "neumorph-inset bg-primary/5"
                        : "neumorph hover:shadow-md"
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar_url || ""} />
                      <AvatarFallback>
                        {(contact.first_name?.[0] || "") + (contact.last_name?.[0] || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium truncate">
                          {contact.first_name} {contact.last_name}
                        </h3>
                        {(contact.unread_count || 0) > 0 && (
                          <span className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {contact.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {isLandlord ? 'Tenant' : 'Landlord'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <NeumorphicCard className="flex-1 flex flex-col h-full overflow-hidden">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={selectedContact.avatar_url || ""} />
                        <AvatarFallback>
                          {(selectedContact.first_name?.[0] || "") +
                            (selectedContact.last_name?.[0] || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {selectedContact.first_name} {selectedContact.last_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isLandlord ? 'Tenant' : 'Landlord'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="neumorph h-9 w-9">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="neumorph h-9 w-9">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 neumorph-inset">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center p-6">
                          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <h3 className="font-medium mb-1">No messages yet</h3>
                          <p className="text-sm text-muted-foreground">
                            Send a message to start the conversation
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isSentByCurrentUser = message.sender_id === currentUser?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                                  isSentByCurrentUser
                                    ? "bg-primary text-white rounded-tr-none neumorph"
                                    : "bg-background rounded-tl-none neumorph-inset"
                                }`}
                              >
                                <p>{message.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isSentByCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                                  }`}
                                >
                                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="neumorph-input"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isSending || !newMessage.trim()}
                        className="neumorph-button bg-primary text-primary-foreground"
                      >
                        {isSending ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
                    <p className="text-muted-foreground mb-4">
                      Select a contact to start messaging
                    </p>
                  </div>
                </div>
              )}
            </NeumorphicCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
