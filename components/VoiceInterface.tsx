"use client";

import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import { useState } from "react";
import EmotionDisplay from "./EmotionDisplay";
import EmotionHistory from "./EmotionHistory";
import TranscriptionDisplay from "./TranscriptionDisplay";
import TranscriptionHistory from "./TranscriptionHistory";

export default function VoiceInterface() {
  const { connect, disconnect, status, isMuted, mute, unmute } = useVoice();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    try {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        {!isConnected ? (
          <Button onClick={handleConnect} size="lg" className="gap-2">
            <Mic className="h-5 w-5" />
            Start Voice Analysis
          </Button>
        ) : (
          <div className="flex gap-4">
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
          </div>
        )}
      </div>

      {isConnected && (
        <>
          <div className="p-4 bg-card border rounded-lg">
            <p className="text-muted-foreground">
              {status.value === "connected"
                ? "Speak naturally and I'll analyze your emotional state..."
                : "Connecting to voice analysis..."}
            </p>
          </div>
          <TranscriptionDisplay />
          <EmotionDisplay />
          <EmotionHistory />
          <TranscriptionHistory />
        </>
      )}
    </div>
  );
} 