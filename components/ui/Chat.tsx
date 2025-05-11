"use client";

import Messages from "../Messages";
import Controls from "../Controls";
import StartCall from "../StartCall";
import { useRef, useState } from "react";
import { useVoice } from "@humeai/voice-react";
import Expressions from "../Expressions";
import { expressionColors } from "@/utils/expressionColors";
import { expressionLabels } from "@/utils/expressionLabels";

export type ChatHandle = {
  handleEndSession: () => void;
};

// Type guard for JSONMessage
function isJSONMessage(msg: any): msg is { models: { prosody: { scores: Record<string, number> } } } {
  return msg && typeof msg === 'object' && 'models' in msg && msg.models?.prosody?.scores;
}

// Type guard for messages with models
function hasModels(msg: any): msg is { models: { prosody: { scores: Record<string, number> } } } {
  return msg && typeof msg === 'object' && 'models' in msg && msg.models?.prosody?.scores;
}

export default function Chat({ onEndSession }: { onEndSession: (sessionData: any) => void }) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const { messages } = useVoice();
  const [showEmotions, setShowEmotions] = useState(false);

  // Find the latest message (partial or final) with emotion scores
  const latestEmotionMsg = [...messages].reverse().find((msg: any) => hasModels(msg));
  const latestEmotions = latestEmotionMsg && hasModels(latestEmotionMsg) ? latestEmotionMsg.models.prosody.scores : null;

  // Helper to extract and build session data
  const buildSessionData = () => {
    const conversation = messages
      .filter((msg: any) =>
        (msg.type === "user_message" && msg.message && typeof msg.message.content === "string") ||
        (msg.type === "assistant_message" && msg.message && typeof msg.message.content === "string")
      )
      .map((msg: any) => {
        if (msg.type === "user_message") {
          return {
            role: "user",
            text: msg.message.content,
            emotions: msg.models?.prosody?.scores || undefined
          };
        } else {
          return {
            role: "voicevitals",
            text: msg.message.content
          };
        }
      });

    // Calculate averaged emotions for the session (user messages only)
    const emotionSums: Record<string, number> = {};
    let emotionCounts: Record<string, number> = {};
    conversation.forEach((msg: any) => {
      if (msg.role === "user" && msg.emotions) {
        Object.entries(msg.emotions).forEach(([emotion, score]) => {
          emotionSums[emotion] = (emotionSums[emotion] || 0) + (score as number);
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      }
    });
    const averagedEmotions = Object.fromEntries(
      Object.entries(emotionSums).map(([emotion, sum]) => [emotion, sum / (emotionCounts[emotion] || 1)])
    );

    return {
      date: new Date().toISOString(),
      conversation,
      averagedEmotions
    };
  };

  // Handler to be called by Controls
  const handleEndSession = () => {
    const sessionData = buildSessionData();
    onEndSession(sessionData);
  };

  return (
    <div ref={innerRef} className="relative grow flex flex-col mx-auto w-full overflow-hidden h-full">
      {/* Toggle Button */}
      <div className="absolute top-2 right-2 z-20">
        <button
          className={`px-3 py-1 rounded shadow text-xs font-semibold transition-colors ${showEmotions ? 'bg-primary text-white' : 'bg-card border hover:bg-muted'}`}
          onClick={() => setShowEmotions(v => !v)}
        >
          {showEmotions ? 'Hide' : 'Show'} Live Emotions
        </button>
      </div>
      {/* Live Emotions Panel */}
      {showEmotions && latestEmotions && (
        <div className="absolute top-12 right-2 z-20 w-72 bg-card border rounded-lg shadow-lg p-4 animate-in fade-in">
          <div className="font-semibold mb-2 text-sm">Live Emotional Data</div>
          {/* Horizontal Bar Chart Visualization */}
          <div className="flex flex-col gap-2">
            {Object.entries(latestEmotions)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([emotion, value]) => (
                <div key={emotion} className="flex items-center gap-2">
                  <span className="w-20 truncate text-xs" style={{color: expressionColors[emotion] || '#8884d8'}}>
                    {expressionLabels[emotion] || emotion}
                  </span>
                  <div className="flex-1 h-3 bg-muted rounded">
                    <div
                      className="h-3 rounded transition-all duration-300"
                      style={{
                        width: `${Math.round((value as number) * 100)}%`,
                        backgroundColor: expressionColors[emotion] || '#8884d8',
                      }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs tabular-nums" style={{color: expressionColors[emotion] || '#8884d8'}}>
                    {((value as number) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
      <Messages ref={innerRef} />
      <Controls onEndSession={handleEndSession} />
      <StartCall />
    </div>
  );
} 