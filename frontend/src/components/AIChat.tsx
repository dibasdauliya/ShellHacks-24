import { Button } from "./ui/button";
import {
  ArrowLeft,
  BadgePlus,
  Loader2,
  Loader2Icon,
  PlayIcon,
  Send,
} from "lucide-react";
import VoiceUploadDialog from "./VoiceModal";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { Constants } from "@/Constants";
import axios from "axios";
import apiClient from "@/utils/apiClient";
import ReactMarkdown from "react-markdown";
import removeMarkdown from "@/utils/rmMd";

interface Message {
  id: number;
  sender: "user" | "ai";
  content: string;
  attachment?: string;
}

export default function AIChat({
  aiNameId,
  aiName,
  askAi,
  finance,
  title,
}: {
  aiNameId?: number;
  aiName?: string;
  askAi?: boolean;
  finance?: boolean;
  title?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "ai", content: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [audioStatus, setAudioStatus] = useState<
    { isLoading: boolean; id: number; audioUrl?: string; error?: string }[]
  >([]);
  const [voice_id, setVoiceId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAIResponse = async (message: string, last5?: string) => {
    let config = {};
    if (finance) {
      config = {
        method: "post",
        url: "/api/finance_ai/",
        data: { user_msg: message, last5 },
      };
      console.log({ config });
    } else {
      config = {
        method: "post",
        url: aiName ? "/api/chat-personal-ai/" : "/api/chat-hw-ai/",
        data: aiName
          ? { pa: aiNameId, user_msg: message }
          : { hid: 1, user_msg: message },
      };
    }

    try {
      const response = await apiClient.request(config);

      console.log({ response });

      if (finance) {
        return {
          message:
            response.data.ai_msg +
            "\n\n**Citation**\n\n" +
            response?.data?.citation,
          id: response.data.id,
        };
      }
      return { message: response.data.ai_msg, id: response.data.id };
    } catch (error) {
      console.error("Error making API request:", error);
      alert("Error making API request");
    }
  };

  const handleUploadComplete = async (s3Url) => {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: Constants.API_URL + askAi ? "/api/setvoice/" : "/api/sethwvoice/",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      data: { voice_url: s3Url },
    };

    console.log({ config });

    if (finance) {
      config["url"] = Constants.API_URL + "/api/setfinvoice/";
    }

    try {
      const response = await axios.request(config);
      if (finance) {
        localStorage.setItem("fin_voice_id", response.data.voice_id);
      } else {
        const voice_id_name = aiName ? "voice_id" : "hw_voice_id";
        localStorage.setItem(voice_id_name, response.data.voice_id);
      }
      setVoiceId(response.data.voice_id);
    } catch (error) {
      console.error("Error making API request:", error);
    }

    // setIsModalOpen(false); // Close the modal after upload is complete
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let voiceIdName = "";
    if (finance) {
      voiceIdName = "fin_voice_id";
    } else {
      voiceIdName = askAi ? "voice_id" : "hw_voice_id";
    }
    const lcVoiceId = localStorage.getItem(voiceIdName);
    console.log({ lcVoiceId });

    if (
      lcVoiceId !== "null" &&
      lcVoiceId !== undefined &&
      lcVoiceId !== null &&
      lcVoiceId !== ""
    ) {
      setVoiceId(lcVoiceId);

      console.log({ lcVoiceId });
    }
  }, []);

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
        const lastFiveAIResponses = messages
          .filter((message) => message.sender === "ai")
          .slice(-5)
          .map((message) => message.content);
        const aiResponse = await getAIResponse(input, lastFiveAIResponses);
        if (aiResponse.message) {
          setMessages((prev) => [
            ...prev,
            { id: aiResponse.id, sender: "ai", content: aiResponse.message },
          ]);
        }
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

  const generateVoice = async (id: number, text: string) => {
    if (!voice_id) {
      alert("Please upload a voice first");
      return;
    }
    // console.log("first");
    setAudioStatus((prev) => [...prev, { isLoading: true, id }]);

    const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
    const headers = {
      "Content-Type": "application/json",
      "xi-api-key": import.meta.env.VITE_XI_API_KEY,
    };

    const requestBody = {
      text: removeMarkdown(text),
      voice_settings: {
        stability: 0.1,
        similarity_boost: 0.3,
        style: 0.2,
      },
    };

    try {
      const response = await axios.post(`${baseUrl}/${voice_id}`, requestBody, {
        headers,
        responseType: "blob",
      });

      if (response.status === 200) {
        const audioUrl = URL.createObjectURL(response.data);
        setAudioStatus((prev) =>
          prev.map((status) =>
            status.id === id
              ? { ...status, isLoading: false, audioUrl: audioUrl }
              : status
          )
        );
      } else {
        throw new Error("Failed to generate voice");
      }
    } catch (error) {
      console.error("Error generating voice:", error);
      setAudioStatus((prev) =>
        prev.map((status) =>
          status.id === id
            ? { ...status, isLoading: false, error: error.message }
            : status
        )
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold flex gap-8 items-center">
            {aiName ? (
              <>Ask {aiName ? aiName.toUpperCase() : "AI"}</>
            ) : finance ? (
              title
            ) : (
              <>Homework Help</>
            )}
          </h1>
        </div>

        {Boolean(voice_id) ? null : (
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="secondary"
            size="sm"
            className="gap-1"
          >
            Add Voice <BadgePlus className="h-4 w-4" />
          </Button>
        )}
        <VoiceUploadDialog
          isOpen={isModalOpen}
          onUploadComplete={handleUploadComplete}
          onClose={() => setIsModalOpen(false)}
        />
      </header>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message) => {
          const audioStatusForMessage = audioStatus.find(
            (status) => status.id === message.id
          );
          return (
            <Card
              key={message.id}
              className={`mb-4 ${
                message.sender === "user" ? "ml-auto" : "mr-auto"
              } max-w-[80%]`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  {message.sender === "ai" && (
                    <>
                      <Avatar>
                        <AvatarImage src="/ai-avatar.png" alt="AI" />
                        <AvatarFallback>
                          {aiName ? (
                            <>{aiName ? aiName[0].toUpperCase() : "AI"}</>
                          ) : (
                            "AI"
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </>
                  )}
                  <div>
                    <div
                      className={
                        message.sender === "user" ? "text-right" : "text-left"
                      }
                    >
                      <div className="prose-sm">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>

                      {message.sender === "ai" && (
                        <div className="flex items-center gap-2 text-sm mt-2">
                          {audioStatusForMessage?.isLoading ? (
                            <Loader2Icon className="animate-spin h-5 w-5 text-black" />
                          ) : audioStatusForMessage?.error ? (
                            <span className="text-red-500">
                              Error: {audioStatusForMessage.error}
                            </span>
                          ) : audioStatusForMessage?.audioUrl ? (
                            <audio
                              controls
                              src={audioStatusForMessage.audioUrl}
                            />
                          ) : (
                            <button
                              className="w-fit flex items-center gap-2 text-xs"
                              onClick={() =>
                                generateVoice(message.id, message.content)
                              }
                            >
                              <PlayIcon className="w-3 h-3" /> Request audio
                            </button>
                          )}
                        </div>
                      )}
                    </div>
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
          );
        })}
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
