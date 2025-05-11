"use client";

import { useVoice } from "@humeai/voice-react";
import { Card } from "./ui/card";

interface TranscriptionEntry {
  text: string;
  confidence: number;
  timestamp: number;
}

export default function TranscriptionHistory() {
  const { messages } = useVoice();

  const getTranscriptionHistory = (): TranscriptionEntry[] => {
    if (!messages || messages.length === 0) return [];

    return messages
      .filter(msg => msg?.models?.transcription?.text)
      .map(msg => ({
        text: msg.models.transcription.text,
        confidence: msg.models.transcription.confidence,
        timestamp: new Date(msg.receivedAt).getTime()
      }));
  };

  const transcriptionHistory = getTranscriptionHistory();
  if (transcriptionHistory.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Transcription History</h3>
      <div className="space-y-4">
        {transcriptionHistory.map((entry, index) => (
          <div key={index} className="border-b pb-4 last:border-0">
            <p className="text-lg mb-1">{entry.text}</p>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Confidence: {(entry.confidence * 100).toFixed(1)}%</span>
              <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 