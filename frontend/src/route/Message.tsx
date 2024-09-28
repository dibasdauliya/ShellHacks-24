"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Send, Smile, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const initialMessages = [
  {
    id: 1,
    sender: "John",
    content: "Hey, how are you?",
    timestamp: "2023-09-15T10:00:00Z",
    reactions: [],
  },
  {
    id: 2,
    sender: "You",
    content: "I'm doing great! How about you?",
    timestamp: "2023-09-15T10:05:00Z",
    reactions: ["👍"],
  },
  {
    id: 3,
    sender: "John",
    content: "Pretty good! Did you see the new movie that came out?",
    timestamp: "2023-09-15T10:10:00Z",
    reactions: [],
  },
  {
    id: 4,
    sender: "You",
    content: "Not yet, but I've heard it's amazing!",
    timestamp: "2023-09-15T10:15:00Z",
    reactions: ["😊"],
  },
];

const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export function MessageAppComponent() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toISOString(),
        reactions: [],
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, reactions: [...msg.reactions, emoji] }
          : msg
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="John" />
            <AvatarFallback className="text-black">JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold">John Doe</h1>
            <p className="text-xs">Online</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col mb-4 ${
              message.sender === "You" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "You"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {format(new Date(message.timestamp), "HH:mm")}
              </p>
            </div>
            {message.reactions.length > 0 && (
              <div className="flex mt-1 space-x-1">
                {message.reactions.map((reaction, index) => (
                  <span key={index} className="bg-muted rounded-full px-2 py-1">
                    {reaction}
                  </span>
                ))}
              </div>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="mt-1">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1">
                <div className="flex space-x-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      className="text-xl p-2 hover:bg-muted rounded"
                      onClick={() => addReaction(message.id, emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </ScrollArea>

      <footer className="p-4 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex space-x-2"
        >
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
