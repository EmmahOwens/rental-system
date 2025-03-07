
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Send, MessageSquare, FileText, Home, Wrench, Clock } from "lucide-react";

export default function Support() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      toast({
        title: "Support request sent",
        description: "We'll get back to you as soon as possible",
      });
      
      setMessage("");
    }
  };

  // FAQ data
  const faqs = [
    {
      question: "How do I report a maintenance issue?",
      answer: "You can report maintenance issues through the Maintenance Request form in your dashboard. Go to the Messages page and select 'New Maintenance Request'."
    },
    {
      question: "When is my rent due?",
      answer: "Rent is due on the 1st of each month. You can view your payment schedule and make payments through the Payments page."
    },
    {
      question: "How do I update my contact information?",
      answer: "You can update your contact information in the Settings page. Click on 'Profile' and edit your details."
    },
    {
      question: "What should I do if I'm locked out?",
      answer: "If you're locked out, please contact emergency support at +256-700-123456."
    },
  ];

  // Support categories
  const categories = [
    { id: "general", label: "General Inquiry", icon: HelpCircle },
    { id: "maintenance", label: "Maintenance Issue", icon: Wrench },
    { id: "payments", label: "Payment Question", icon: FileText },
    { id: "property", label: "Property Concern", icon: Home },
    { id: "other", label: "Other", icon: MessageSquare },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Support</h1>
        <p className="text-muted-foreground">Get help and find answers to your questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NeumorphicCard className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Contact Support
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="neumorph-input w-full"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="neumorph-input w-full min-h-32"
                  placeholder="Describe your issue or question..."
                  required
                />
              </div>
              
              <button type="submit" className="neumorph-button flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </NeumorphicCard>
          
          <NeumorphicCard className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="neumorph p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </NeumorphicCard>
        </div>
        
        <div>
          <NeumorphicCard className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Support Hours
            </h2>
            
            <div className="space-y-4">
              <div className="neumorph p-4 rounded-lg">
                <h3 className="font-medium mb-2">General Support</h3>
                <p className="text-sm text-muted-foreground">Monday to Friday</p>
                <p className="text-sm text-muted-foreground">8:00 AM - 5:00 PM EAT</p>
              </div>
              
              <div className="neumorph p-4 rounded-lg">
                <h3 className="font-medium mb-2">Emergency Support</h3>
                <p className="text-sm text-muted-foreground">24/7 Available</p>
                <p className="text-sm text-muted-foreground">+256-700-123456</p>
              </div>
              
              <div className="neumorph p-4 rounded-lg">
                <h3 className="font-medium mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@cozyrentals.ug</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
