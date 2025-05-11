"use client";

import { useVoice, type VoiceMessage, hasTranscription } from "@humeai/voice-react";
import { Card } from "./ui/card";

interface TranscriptionDisplayProps {
  messages: VoiceMessage[];
}

export default function TranscriptionDisplay({ messages }: TranscriptionDisplayProps) {
  if (!messages.length) return null;
    
  const latestMessage = messages[messages.length - 1];
  
  if (!hasTranscription(latestMessage)) {
    return null;
  }

  const transcription = {
    text: latestMessage.models.transcription.text,
    confidence: latestMessage.models.transcription.confidence
  };

  return (
    <Card className="p-4">
      <p className="text-sm text-gray-600">{transcription.text}</p>
      <p className="text-xs text-gray-400 mt-1">
        Confidence: {(transcription.confidence * 100).toFixed(1)}%
      </p>
    </Card>
  );
} 