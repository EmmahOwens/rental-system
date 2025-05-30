
import React, { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, Search, Users, Phone, Video } from "lucide-react";
import { 
  getTenantLandlords, 
  getLandlordTenants, 
  TenantWithConnection,
  LandlordWithConnection 
} from "@/utils/connectionUtils";
import { 
  Message, 
  getMessages, 
  markMessagesAsRead, 
  subscribeToMessages, 
  sendMessage,
  updateConnectionUnreadCount 
} from "@/utils/messageUtils";

type ContactWithConnection = TenantWithConnection | LandlordWithConnection;

export default function Messages() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ContactWithConnection[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactWithConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLandlord = user?.role === 'landlord';

  // Fetch contacts based on user role
  useEffect(() => {
    async function loadContacts() {
      if (!profile?.id) return;
      
      try {
        setIsLoading(true);
        let loadedContacts: ContactWithConnection[] = [];
        
        if (isLandlord) {
          // Landlords see their tenants
          loadedContacts = await getLandlordTenants(profile.id);
        } else {
          // Tenants see their landlords
          loadedContacts = await getTenantLandlords(profile.id);
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
  }, [profile?.id, isLandlord, toast, selectedContact]);

  // Load messages when selected contact changes
  useEffect(() => {
    async function loadMessages() {
      if (!profile?.id || !selectedContact?.id) return;
      
      try {
        const loadedMessages = await getMessages(profile.id, selectedContact.id);
        setMessages(loadedMessages);
        
        // Mark messages as read
        if (selectedContact.connection_id) {
          await markMessagesAsRead(selectedContact.connection_id, profile.id);
          await updateConnectionUnreadCount(selectedContact.connection_id, 0);
          
          // Update unread count for the selected contact
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
  }, [profile?.id, selectedContact, toast]);

  // Subscribe to new messages
  useEffect(() => {
    if (!profile?.id) return;
    
    const subscription = subscribeToMessages(profile.id, (payload: any) => {
      const newMessage = payload.new;
      
      // Add the new message to the message list if it belongs to the current conversation
      if (
        selectedContact &&
        ((newMessage.sender_id === profile.id && newMessage.receiver_id === selectedContact.id) ||
          (newMessage.sender_id === selectedContact.id && newMessage.receiver_id === profile.id))
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessage,
            sender: newMessage.sender_id === profile.id ? profile : selectedContact,
            receiver: newMessage.receiver_id === profile.id ? profile : selectedContact,
          },
        ]);
        
        // Mark message as read if received in current conversation
        if (newMessage.sender_id === selectedContact.id && selectedContact.connection_id) {
          markMessagesAsRead(selectedContact.connection_id, profile.id);
          updateConnectionUnreadCount(selectedContact.connection_id, 0);
        }
      } else {
        // Update unread count for contacts not in current conversation
        setContacts((prevContacts) =>
          prevContacts.map((contact) => {
            if (contact.id === newMessage.sender_id && newMessage.connection_id === contact.connection_id) {
              return {
                ...contact,
                unread_count: (contact.unread_count || 0) + 1,
              };
            }
            return contact;
          })
        );
        
        // Show toast for new message if not in the current conversation
        const sender = contacts.find(c => c.id === newMessage.sender_id);
        if (sender) {
          toast({
            title: "New message",
            description: `You have a new message from ${sender.first_name || "someone"}`,
          });
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [profile?.id, selectedContact, contacts, toast]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !profile?.id || !selectedContact?.id) return;
    
    try {
      setIsSending(true);
      await sendMessage({
        content: newMessage.trim(),
        sender_id: profile.id,
        receiver_id: selectedContact.id,
        connection_id: selectedContact.connection_id
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
                        {(contact.unread_count > 0) && (
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
                          const isSentByCurrentUser = message.sender_id === profile?.id;
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
