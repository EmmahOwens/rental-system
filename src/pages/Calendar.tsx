
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Info, 
  Plus, 
  X, 
  CalendarPlus 
} from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, isSameDay, parse } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

// Event type definition
type Event = {
  id: string;
  title: string;
  date: Date;
  type: "payment" | "inspection" | "maintenance" | "meeting" | "personal";
  description?: string;
  user_id: string;
  is_public: boolean;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    time: "12:00",
    type: "personal" as "payment" | "inspection" | "maintenance" | "meeting" | "personal",
    description: "",
    is_public: false,
  });
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);

        // Fetch public events and user's private events
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .or(`is_public.eq.true,user_id.eq.${currentUser.id}`)
          .gte('date', monthStart.toISOString())
          .lte('date', monthEnd.toISOString());

        if (error) throw error;

        const parsedEvents = data.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          type: event.type,
          description: event.description,
          user_id: event.user_id,
          is_public: event.is_public
        }));

        setEvents(parsedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Failed to load events",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate, currentUser?.id, toast]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    try {
      // Combine date and time
      const dateTimeStr = `${format(newEvent.date, "yyyy-MM-dd")}T${newEvent.time}:00`;
      const eventDateTime = new Date(dateTimeStr);

      const newEventData = {
        id: uuidv4(),
        title: newEvent.title,
        date: eventDateTime.toISOString(),
        type: newEvent.type,
        description: newEvent.description,
        user_id: currentUser.id,
        is_public: newEvent.is_public
      };

      const { error } = await supabase
        .from('calendar_events')
        .insert(newEventData);

      if (error) throw error;

      // Add to local state
      setEvents(prev => [...prev, {
        ...newEventData,
        date: eventDateTime
      }]);

      // Reset form
      setNewEvent({
        title: "",
        date: new Date(),
        time: "12:00",
        type: "personal",
        description: "",
        is_public: false
      });

      setShowAddEvent(false);

      toast({
        title: "Event added",
        description: "Your event has been added to the calendar",
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Failed to add event",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', currentUser?.id);

      if (error) throw error;

      // Remove from local state
      setEvents(prev => prev.filter(event => event.id !== eventId));

      toast({
        title: "Event deleted",
        description: "Your event has been removed from the calendar",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Failed to delete event",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "EEE";
    const days = [];
    let day = startDate;
    
    // Days of week header
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      daysOfWeek.push(
        <div key={`header-${i}`} className="text-center font-medium py-2">
          {format(addDays(day, i), dateFormat)}
        </div>
      );
    }
    days.push(<div key="header" className="grid grid-cols-7 mb-2">{daysOfWeek}</div>);

    // Calendar cells
    let formattedDate = "";
    const rows = [];
    let daysInRow = [];
    day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const eventsForDay = events.filter(event => isSameDay(event.date, cloneDay));
        
        daysInRow.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] p-2 border border-border ${
              !isSameMonth(day, monthStart)
                ? "text-muted-foreground"
                : isToday(day)
                ? "bg-primary/10 font-bold"
                : ""
            } neumorph rounded-lg`}
            onClick={() => {
              setNewEvent(prev => ({ ...prev, date: cloneDay }));
              setShowAddEvent(true);
            }}
          >
            <div className="text-right mb-1">{formattedDate}</div>
            <div className="text-xs space-y-1">
              {eventsForDay.map(event => (
                <div 
                  key={event.id}
                  className={`p-1 rounded text-white flex justify-between items-center ${
                    event.type === 'payment' ? 'bg-green-500' :
                    event.type === 'inspection' ? 'bg-amber-500' :
                    event.type === 'maintenance' ? 'bg-blue-500' :
                    event.type === 'meeting' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}
                >
                  <span className="truncate">{event.title}</span>
                  {event.user_id === currentUser?.id && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(event.id);
                      }}
                      className="ml-1 hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-2 mb-2">
          {daysInRow}
        </div>
      );
      daysInRow = [];
    }
    
    return <div>{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Get today's events
  const todayEvents = events.filter(event => isToday(event.date));

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Calendar</h1>
        <p className="text-muted-foreground">View and manage your schedule and important dates</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <NeumorphicCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="neumorph-button p-2">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setShowAddEvent(true)} 
                  className="neumorph-button py-2 px-3 flex items-center gap-1"
                >
                  <CalendarPlus className="h-4 w-4" />
                  <span>Add Event</span>
                </button>
                <button onClick={nextMonth} className="neumorph-button p-2">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">Loading calendar...</p>
              </div>
            ) : (
              renderCalendarDays()
            )}
          </NeumorphicCard>
        </div>

        <div>
          <NeumorphicCard className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Events
            </h2>
            
            {todayEvents.length > 0 ? (
              <div className="space-y-4">
                {todayEvents.map(event => (
                  <div key={event.id} className="neumorph p-4 rounded-lg">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                      {event.user_id === currentUser?.id && (
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(event.date, "h:mm a")}
                    </p>
                    <span className={`mt-2 inline-block px-2 py-0.5 text-xs rounded-full text-white ${
                      event.type === 'payment' ? 'bg-green-500' :
                      event.type === 'inspection' ? 'bg-amber-500' :
                      event.type === 'maintenance' ? 'bg-blue-500' :
                      event.type === 'meeting' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center neumorph rounded-lg">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events scheduled for today</p>
                <button 
                  onClick={() => setShowAddEvent(true)}
                  className="neumorph-button py-2 px-3 mt-4 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Event</span>
                </button>
              </div>
            )}
          </NeumorphicCard>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="neumorph bg-background p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Event</h2>
              <button 
                onClick={() => setShowAddEvent(false)}
                className="neumorph p-2 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="neumorph-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={format(newEvent.date, "yyyy-MM-dd")}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : new Date();
                    setNewEvent({...newEvent, date});
                  }}
                  className="neumorph-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="neumorph-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                  className="neumorph-input w-full"
                >
                  <option value="personal">Personal</option>
                  <option value="payment">Payment</option>
                  <option value="inspection">Inspection</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="neumorph-input w-full"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={newEvent.is_public}
                  onChange={(e) => setNewEvent({...newEvent, is_public: e.target.checked})}
                  className="neumorph-input"
                />
                <label htmlFor="is_public" className="text-sm">
                  Make this event visible to everyone
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="neumorph-button py-2 px-4 w-1/2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neumorph-button py-2 px-4 w-1/2 bg-primary text-primary-foreground"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
