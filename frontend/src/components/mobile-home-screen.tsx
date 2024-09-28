"use client";

import {
  Camera,
  Calendar,
  Clock,
  Compass,
  FileText,
  Gamepad2,
  Image,
  Mail,
  Music2,
  Phone,
  Settings,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";

const apps = [
  { name: "Camera", icon: Camera },
  { name: "Calendar", icon: Calendar },
  { name: "Clock", icon: Clock },
  { name: "Compass", icon: Compass },
  { name: "Notes", icon: FileText },
  { name: "Games", icon: Gamepad2 },
  { name: "Gallery", icon: Image },
  { name: "Mail", icon: Mail },
  { name: "Music", icon: Music2 },
  { name: "Phone", icon: Phone },
  { name: "Settings", icon: Settings },
  { name: "Store", icon: Store },
];

export function MobileHomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4 grid place-items-center">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Good Phone</h1>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleString("en-US", {
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
          {apps.map((app, index) => (
            <Link
              to={`/${app.name}`}
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
