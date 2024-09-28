"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { Constants } from "@/Constants";
import apiClient from "@/utils/apiClient";
import { set } from "date-fns";

// PA: id, user_msg: msg
const getAIResponse = async (
  message: string,
  aiId: Number
): Promise<string> => {
  const config = {
    method: "post",
    url: "/api/chat-personal-ai/",
    data: { pa: aiId, user_msg: message },
  };

  try {
    const response = await apiClient.request(config);
    return response.data.ai_msg;
  } catch (error) {
    console.error("Error making API request:", error);
    alert("Error making API request");
  }

  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  //   return `Here's an AI response to: "${message}"`;
};

interface Message {
  id: number;
  sender: "user" | "ai";
  content: string;
  attachment?: string;
}

export function AskAiPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "ai", content: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiNameId, setAiNameId] = useState<Number>();
  const [aiName, setAiName] = useState<string>();

  useEffect(() => {
    const lcAiId = localStorage.getItem("aiId");
    const lcAiName = localStorage.getItem("aiName");
    console.log(lcAiId);
    if (lcAiId == "null" || lcAiId == null || lcAiId == undefined) {
      const aiId = prompt("Enter AI name:");
      if (aiId) {
        postAiID(aiId);
      } else {
        window.history.back();
      }
    } else {
      setAiNameId(lcAiId);
      setAiName(lcAiName);
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  async function postAiID(aiName: string) {
    const config = {
      method: "post",
      url: Constants.API_URL + "/api/name-ai/",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      data: { name: aiName },
    };

    try {
      const response = await axios.request(config);
      console.log({ response: response.data });
      setAiNameId(response.data.id);
      setAiName(aiName);
      localStorage.setItem("aiId", response.data.id);
      localStorage.setItem("aiName", aiName);
    } catch (error) {
      console.error("Error making API request:", error);
      alert("Error making API request");
    }
  }

  const handleSend = async () => {
    if (input.trim() || fileInputRef.current?.files?.length) {
      const newUserMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        content: input.trim(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const aiResponse = await getAIResponse(input, aiNameId);
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
        <h1 className="text-xl font-semibold">
          Ask {aiName ? aiName.toUpperCase() : "AI"}
        </h1>
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
                    <AvatarFallback>
                      {aiName ? aiName[0].toUpperCase() : "AI"}
                    </AvatarFallback>
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
        </form>
      </footer>
    </div>
  );
}
