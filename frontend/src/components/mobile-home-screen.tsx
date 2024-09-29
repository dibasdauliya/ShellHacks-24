"use client";

import {
  Camera,
  Calendar,
  BotMessageSquare,
  Newspaper,
  MessageCircle,
  Image,
  Phone,
  Video,
  BrainCircuit,
  NotebookPen,
  CloudSunRain,
  Receipt,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const apps = [
  { name: "Camera", icon: Camera },
  { name: "Calendar", icon: Calendar },
  { name: "Ask AI", icon: BotMessageSquare },
  { name: "Message", icon: MessageCircle },
  { name: "News", icon: Newspaper },
  { name: "Gallery", icon: Image },
  { name: "Phone", icon: Phone },
  { name: "Video", icon: Youtube },
  { name: "Homework AI", icon: BrainCircuit },
  { name: "Notes AI", icon: NotebookPen },
  { name: "Weather", icon: CloudSunRain },
  {
    name: "Finance Help",
    icon: Receipt,
  },
];

export function MobileHomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4 grid place-items-center">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Good Fone</h1>
          <p className="text-sm text-gray-600 mt-3">
            {currentTime.toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {apps
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((app, index) => (
              <Link
                to={`/${app.name.split(" ").join("-").toLowerCase()}`}
                key={index}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
                  <app.icon className="w-8 h-8 text-blue-500" />
                </div>
                <span className="mt-2 text-xs text-center text-gray-700">
                  {app.name}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
