"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dummyEvents = [
  { id: 1, date: "2023-09-15", title: "Team Meeting" },
  { id: 2, date: "2023-09-20", title: "Project Deadline" },
  { id: 3, date: "2023-09-25", title: "Client Presentation" },
  { id: 4, date: "2023-10-05", title: "Quarterly Review" },
  { id: 5, date: "2023-10-12", title: "Team Building" },
  { id: 6, date: "2023-10-18", title: "Product Launch" },
];

export function CalendarApp() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState(dummyEvents);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      isSameMonth(parseISO(event.date), currentMonth)
    );
  }, [events, currentMonth]);

  const addNewEvent = () => {
    if (selectedDate && newEventTitle) {
      const newEvent = {
        id: events.length + 1,
        date: format(selectedDate, "yyyy-MM-dd"),
        title: newEventTitle,
      };
      setEvents([...events, newEvent]);
      setNewEventTitle("");
      setSelectedDate(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <Card className="flex-grow overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </header>

          <ScrollArea className="flex-grow">
            <div className="grid grid-cols-7 gap-1 p-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
              {daysInMonth.map((day) => (
                <Button
                  key={day.toString()}
                  variant="ghost"
                  className={`h-14 p-1 ${
                    !isSameMonth(day, currentMonth) ? "text-gray-300" : ""
                  } ${isSameDay(day, new Date()) ? "bg-blue-100" : ""}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-sm">{format(day, "d")}</span>
                    {events.some((event) =>
                      isSameDay(parseISO(event.date), day)
                    ) && (
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <h3 className="font-semibold mb-2">Events this Month</h3>
            <ul className="space-y-2">
              {filteredEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex justify-between items-center"
                >
                  <span>{event.title}</span>
                  <span className="text-sm text-gray-500">
                    {format(parseISO(event.date), "MMM d")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4 w-full" size="lg">
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={addNewEvent}>Add Event</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
