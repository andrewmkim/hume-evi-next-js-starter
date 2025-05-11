"use client";

import { useVoice } from "@humeai/voice-react";
import { Card } from "./ui/card";

export default function TranscriptionDisplay() {
  const { messages } = useVoice();

  const getLatestTranscription = () => {
    if (!messages || messages.length === 0) return null;
    
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage?.models?.transcription?.text) return null;

    return {
      text: latestMessage.models.transcription.text,
      confidence: latestMessage.models.transcription.confidence
    };
  };

  const transcription = getLatestTranscription();
  if (!transcription) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">Transcription</h3>
      <div className="space-y-2">
        <p className="text-lg">{transcription.text}</p>
        <p className="text-sm text-muted-foreground">
          Confidence: {(transcription.confidence * 100).toFixed(1)}%
        </p>
      </div>
    </Card>
  );
} 