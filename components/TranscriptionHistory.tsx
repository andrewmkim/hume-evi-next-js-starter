"use client";

import { type VoiceMessage } from "@humeai/voice-react";
import { Card } from "./ui/card";

interface TranscriptionHistoryProps {
  messages: VoiceMessage[];
}

export default function TranscriptionHistory({ messages }: TranscriptionHistoryProps) {
  const transcriptions = messages
    .filter((msg): msg is VoiceMessage & { models: { transcription: { text: string; confidence: number } } } => 
      'models' in msg && 
      !!msg.models?.transcription?.text
    )
    .map(msg => ({
      text: msg.models.transcription.text,
      confidence: msg.models.transcription.confidence,
      timestamp: msg.receivedAt
    }));

  if (!transcriptions.length) return null;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Transcription History</h3>
      <div className="space-y-2">
        {transcriptions.map((transcription, index) => (
          <div key={index} className="border-b pb-2 last:border-0">
            <p className="text-sm text-gray-600">{transcription.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              Confidence: {(transcription.confidence * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400">
              {transcription.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
} 