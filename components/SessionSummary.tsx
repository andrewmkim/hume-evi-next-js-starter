"use client";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
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

interface SessionSummaryProps {
  messages: Message[];
  onSave: (reflection: string) => void;
}

export default function SessionSummary({ messages, onSave }: SessionSummaryProps) {
  const [reflection, setReflection] = useState("");

  const getEmotionAverages = () => {
    const userMessages = messages.filter(m => m.isUser && m.emotions);
    if (userMessages.length === 0) return [];

    const emotionSums: { [key: string]: number } = {};
    const emotionCounts: { [key: string]: number } = {};

    userMessages.forEach(message => {
      if (!message.emotions) return;
      Object.entries(message.emotions).forEach(([emotion, score]) => {
        emotionSums[emotion] = (emotionSums[emotion] || 0) + score;
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    return Object.entries(emotionSums)
      .map(([emotion, sum]) => ({
        emotion: expressionLabels[emotion] || emotion,
        value: sum / emotionCounts[emotion],
        fill: expressionColors[emotion] || "#8884d8"
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const emotionData = getEmotionAverages();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Session Summary</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={emotionData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="emotion" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              <Radar
                name="Emotions"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">How did you feel after this chat?</h3>
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Share your thoughts..."
          className="mb-4"
        />
        <Button
          onClick={() => onSave(reflection)}
          disabled={!reflection.trim()}
        >
          Save Reflection
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Emotion Timeline</h3>
        <div className="space-y-4">
          {messages
            .filter(m => m.isUser && m.emotions)
            .map((message, index) => (
              <div key={message.id} className="border-b pb-4 last:border-0">
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
                <p className="mb-2">{message.text}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(message.emotions || {})
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
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
} 