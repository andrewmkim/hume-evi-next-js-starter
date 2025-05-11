"use client";

import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { expressionLabels } from "@/utils/expressionLabels";
import { expressionColors } from "@/utils/expressionColors";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  emotions?: {
    [key: string]: number;
  };
}

interface ChatInterfaceProps {
  onAccessToken: (token: string) => void;
}

export default function ChatInterface({ onAccessToken }: ChatInterfaceProps) {
  const { connect, disconnect, status, isMuted, mute, unmute, messages } = useVoice();
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if ('models' in latestMessage && latestMessage.models?.transcription?.text) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: latestMessage.models.transcription.text,
          isUser: true,
          timestamp: new Date(latestMessage.receivedAt).getTime(),
          emotions: latestMessage.models.prosody?.scores
        };
        setChatMessages(prev => [...prev, newMessage]);
      }
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleConnect = async () => {
    try {
      // Get access token from API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'start' }),
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const { accessToken } = await response.json();
      onAccessToken(accessToken);
      
      // Wait a moment for the token to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Then connect
      await connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsConnected(false);
  };

  const getTopEmotions = (emotions?: { [key: string]: number }) => {
    if (!emotions) return [];
    return Object.entries(emotions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([name, score]) => ({ name, score }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-muted-foreground">
              Hey there. What's on your mind today?
            </p>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${message.isUser ? "order-2" : "order-1"}`}>
                <Card className={`p-4 ${message.isUser ? "bg-primary text-primary-foreground" : ""}`}>
                  <p>{message.text}</p>
                  {message.emotions && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(message.emotions)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([emotion, score]) => (
                          <span
                            key={emotion}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: expressionColors[emotion] || "#8884d8",
                              color: "white"
                            }}
                          >
                            {expressionLabels[emotion] || emotion}: {(score * 100).toFixed(0)}%
                          </span>
                        ))}
                    </div>
                  )}
                </Card>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          {!isConnected ? (
            <Button onClick={handleConnect} size="lg" className="gap-2">
              <Mic className="h-5 w-5" />
              Start Voice Chat
            </Button>
          ) : (
            <>
              <Button
                onClick={isMuted ? unmute : mute}
                variant={isMuted ? "destructive" : "default"}
                size="lg"
                className="gap-2"
              >
                {isMuted ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Mute
                  </>
                )}
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                End Session
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 