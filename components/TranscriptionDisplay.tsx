"use client";

import { useVoice, type VoiceMessage } from "@humeai/voice-react";
import { Card } from "./ui/card";

interface TranscriptionDisplayProps {
  messages: VoiceMessage[];
}

export default function TranscriptionDisplay({ messages }: TranscriptionDisplayProps) {
  if (!messages.length) return null;
    
  const latestMessage = messages[messages.length - 1];
  
  // Add type guard to check if the message has models and transcription
  if (!latestMessage || 
      !('models' in latestMessage) || 
      !latestMessage.models?.transcription?.text) {
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