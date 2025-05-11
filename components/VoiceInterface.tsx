"use client";

import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import TranscriptionDisplay from "./TranscriptionDisplay";
import EmotionDisplay from "./EmotionDisplay";
import EmotionHistory from "./EmotionHistory";
import TranscriptionHistory from "./TranscriptionHistory";

export default function VoiceInterface() {
  const { 
    connect, 
    disconnect, 
    status, 
    isMuted, 
    mute, 
    unmute,
    messages 
  } = useVoice();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Voice Interface</h2>
            <p className="text-sm text-gray-500">
              Status: {status.value}
            </p>
          </div>
          <div className="space-x-2">
            {status.value === "disconnected" ? (
              <Button onClick={handleConnect}>Connect</Button>
            ) : (
              <>
                <Button onClick={disconnect}>Disconnect</Button>
                <Button onClick={isMuted ? unmute : mute}>
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <TranscriptionDisplay messages={messages} />
        <EmotionDisplay messages={messages} />
        <EmotionHistory messages={messages} />
        <TranscriptionHistory messages={messages} />
      </div>
    </div>
  );
} 