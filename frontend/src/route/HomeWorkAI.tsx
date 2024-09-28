"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// Dummy function to simulate AI response
const getAIResponse = async (message: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  return `Here's an AI response to: "${message}"`;
};

interface Message {
  id: number;
  sender: "user" | "ai";
  content: string;
  attachment?: string;
}

export function HomeWorkAI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "ai", content: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() || fileInputRef.current?.files?.length) {
      const newUserMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        content: input.trim(),
      };

      if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        newUserMessage.attachment = file.name;
      }

      setMessages((prev) => [...prev, newUserMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const aiResponse = await getAIResponse(input);
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "ai", content: aiResponse },
        ]);
      } catch (error) {
        console.error("Error getting AI response:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "ai",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Ask AI</h1>
      </header>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`mb-4 ${
              message.sender === "user" ? "ml-auto" : "mr-auto"
            } max-w-[80%]`}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                {message.sender === "ai" && (
                  <Avatar>
                    <AvatarImage src="/ai-avatar.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p
                    className={
                      message.sender === "user" ? "text-right" : "text-left"
                    }
                  >
                    {message.content}
                  </p>
                  {message.attachment && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Attached: {message.attachment}
                    </p>
                  )}
                </div>
                {message.sender === "user" && (
                  <Avatar className="ml-auto">
                    <AvatarImage src="/user-avatar.png" alt="User" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </ScrollArea>

      <footer className="p-4 bg-background border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleFileUpload}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={() => handleSend()}
          />
        </form>
      </footer>
    </div>
  );
}
