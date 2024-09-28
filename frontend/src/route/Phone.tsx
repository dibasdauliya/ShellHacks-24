"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, User, Clock } from "lucide-react";

export function PhonePage() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const dialPad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  const recentCalls = [
    { name: "John Doe", time: "5 mins ago", type: "Outgoing" },
    { name: "Jane Smith", time: "1 hour ago", type: "Incoming" },
    { name: "Alice Johnson", time: "Yesterday", type: "Missed" },
  ];

  const contacts = [
    { name: "John Doe", number: "123-456-7890" },
    { name: "Jane Smith", number: "234-567-8901" },
    { name: "Alice Johnson", number: "345-678-9012" },
  ];

  const handleDialPadClick = (digit: string) => {
    setPhoneNumber((prev) => prev + digit);
  };

  return (
    <div className="max-w-md mx-auto bg-background text-foreground p-4 rounded-lg shadow-lg">
      <Tabs defaultValue="dialpad" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dialpad">
            <Phone className="w-5 h-5 mr-2" />
            Dial
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="w-5 h-5 mr-2" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <User className="w-5 h-5 mr-2" />
            Contacts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dialpad">
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="text-2xl text-center mb-4"
            placeholder="Enter phone number"
          />
          <div className="grid grid-cols-3 gap-4 mb-4">
            {dialPad.flat().map((digit) => (
              <Button
                key={digit}
                variant="outline"
                className="text-2xl h-16"
                onClick={() => handleDialPadClick(digit)}
              >
                {digit}
              </Button>
            ))}
          </div>
          <Button
            className="w-full h-16 text-xl"
            onClick={() => alert("Work in progress!")}
          >
            <Phone className="w-6 h-6 mr-2" />
            Call
          </Button>
        </TabsContent>
        <TabsContent value="recent">
          <div className="space-y-4">
            {recentCalls.map((call, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>{call.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{call.name}</p>
                    <p className="text-sm text-muted-foreground">{call.time}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alert("Work in progress!")}
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="contacts">
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.number}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alert("Work in progress!")}
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
