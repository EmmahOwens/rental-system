
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Info } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, isSameDay } from "date-fns";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Rent Payment Due",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      type: "payment"
    },
    {
      id: 2,
      title: "Property Inspection",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 10, 0),
      type: "inspection"
    },
    {
      id: 3,
      title: "Maintenance Visit",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 14, 30),
      type: "maintenance"
    },
    {
      id: 4,
      title: "Community Meeting",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 18, 0),
      type: "meeting"
    }
  ];

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
          >
            <div className="text-right mb-1">{formattedDate}</div>
            <div className="text-xs space-y-1">
              {eventsForDay.map(event => (
                <div 
                  key={event.id}
                  className={`p-1 rounded text-white ${
                    event.type === 'payment' ? 'bg-green-500' :
                    event.type === 'inspection' ? 'bg-amber-500' :
                    event.type === 'maintenance' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}
                >
                  {event.title}
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
                <button onClick={nextMonth} className="neumorph-button p-2">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {renderCalendarDays()}
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
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(event.date, "h:mm a")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center neumorph rounded-lg">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events scheduled for today</p>
              </div>
            )}
          </NeumorphicCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
