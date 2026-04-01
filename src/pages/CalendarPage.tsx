import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { sampleProjects } from "@/data/wedding-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, MapPin, Users, Camera, Video,
  Edit3, CalendarDays as CalIcon,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  projectId: string;
  clientLabel: string;
  subEventName: string;
  date: string;
  location: string;
  status: "upcoming" | "in-progress" | "completed";
  teamCount: number;
}

const statusDot: Record<string, string> = {
  upcoming: "bg-muted-foreground/40",
  "in-progress": "bg-blue-500",
  completed: "bg-emerald-500",
};

const statusBadge: Record<string, string> = {
  upcoming: "bg-muted text-muted-foreground border-border",
  "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CalendarPage = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Flatten all sub-events across projects
  const allEvents: CalendarEvent[] = useMemo(() => {
    return sampleProjects.flatMap((project) =>
      project.subEvents.map((se) => ({
        id: se.id,
        projectId: project.id,
        clientLabel: `${project.clientName} & ${project.partnerName}`,
        subEventName: se.name,
        date: se.date,
        location: se.location,
        status: se.status,
        teamCount: se.assignedTeam.length,
      }))
    );
  }, []);

  // Events indexed by date string
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    allEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [allEvents]);

  // Calendar grid
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const calendarCells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    calendarCells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, month: currentMonth, year: currentYear, isCurrentMonth: true });
  }
  // Next month leading days
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    calendarCells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const goToday = () => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const formatDateStr = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  // Selected date events
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  // Stats
  const thisMonthEvents = allEvents.filter((ev) => {
    const d = new Date(ev.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const upcomingCount = thisMonthEvents.filter((e) => e.status === "upcoming").length;
  const completedCount = thisMonthEvents.filter((e) => e.status === "completed").length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Event Calendar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {thisMonthEvents.length} events this month · {upcomingCount} upcoming · {completedCount} completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
            <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Calendar grid */}
          <div className="flex-1">
            {/* Month/Year label */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-display font-semibold text-foreground">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/60 py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 border-t border-l border-border">
              {calendarCells.map((cell, idx) => {
                const dateStr = formatDateStr(cell.year, cell.month, cell.day);
                const dayEvents = eventsByDate[dateStr] || [];
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      "border-r border-b border-border min-h-[80px] p-1.5 cursor-pointer transition-colors hover:bg-muted/30",
                      !cell.isCurrentMonth && "opacity-30",
                      isSelected && "bg-primary/5 border-primary/30",
                    )}
                  >
                    <div className={cn(
                      "text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full",
                      isToday && "bg-primary text-primary-foreground",
                      !isToday && "text-muted-foreground",
                    )}>
                      {cell.day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          className={cn(
                            "text-[9px] leading-tight px-1 py-0.5 rounded truncate",
                            ev.status === "completed" && "bg-emerald-500/15 text-emerald-400",
                            ev.status === "in-progress" && "bg-blue-500/15 text-blue-400",
                            ev.status === "upcoming" && "bg-muted text-muted-foreground",
                          )}
                          title={`${ev.subEventName} - ${ev.clientLabel}`}
                        >
                          {ev.subEventName}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[9px] text-muted-foreground px-1">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: selected date details */}
          <div className="w-72 shrink-0 hidden lg:block">
            <div className="rounded-xl bg-card border border-border overflow-hidden sticky top-4">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
                  <CalIcon className="h-4 w-4 text-primary" />
                  {selectedDate
                    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
                    : "Select a date"}
                </h3>
              </div>

              {!selectedDate ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  Click on a date to see scheduled events
                </div>
              ) : selectedEvents.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No events on this date
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {selectedEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => navigate(`/projects/${ev.projectId}`)}
                      className="p-3 hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={cn("h-2 w-2 rounded-full shrink-0", statusDot[ev.status])} />
                        <p className="text-sm font-medium text-foreground">{ev.subEventName}</p>
                      </div>
                      <p className="text-xs text-primary mb-2 ml-4">{ev.clientLabel}</p>
                      <div className="space-y-1 ml-4 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>{ev.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3 w-3 shrink-0" />
                          <span>{ev.teamCount} team members</span>
                        </div>
                      </div>
                      <div className="mt-2 ml-4">
                        <Badge variant="outline" className={cn("text-[9px]", statusBadge[ev.status])}>
                          {ev.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
