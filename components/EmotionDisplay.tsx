"use client";

import { useVoice } from "@humeai/voice-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "./ui/card";
import { expressionLabels } from "@/utils/expressionLabels";
import { expressionColors } from "@/utils/expressionColors";

interface EmotionScore {
  name: string;
  score: number;
}

export default function EmotionDisplay() {
  const { messages } = useVoice();

  const getLatestEmotions = (): EmotionScore[] => {
    if (!messages || messages.length === 0) return [];
    
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || typeof latestMessage !== 'object' || !('models' in latestMessage) || !latestMessage.models?.prosody?.scores) return [];

    return Object.entries(latestMessage.models.prosody.scores)
      .map(([name, score]) => ({
        name: expressionLabels[name as keyof typeof expressionLabels] || name,
        score: Number(score)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const getEmotionSummary = () => {
    const emotions = getLatestEmotions();
    if (emotions.length === 0) return "Waiting for voice input...";
    
    const topEmotions = emotions.slice(0, 3);
    const emotionNames = topEmotions.map(e => e.name.toLowerCase());
    
    if (emotionNames.length === 1) {
      return `You're expressing strong ${emotionNames[0]}.`;
    } else if (emotionNames.length === 2) {
      return `You're showing ${emotionNames[0]} and ${emotionNames[1]}.`;
    } else {
      return `Your primary emotions are ${emotionNames[0]}, ${emotionNames[1]}, and ${emotionNames[2]}.`;
    }
  };

  const emotions = getLatestEmotions();

  if (emotions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Current Emotional State</h3>
        <p className="text-muted-foreground">Waiting for voice input...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Current Emotional State</h3>
        <p className="text-muted-foreground mb-4">{getEmotionSummary()}</p>
        
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emotions}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="score" 
                fill="#8884d8"
                background={{ fill: '#eee' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Emotional Insights</h3>
        <div className="space-y-4">
          {emotions.map((emotion) => (
            <div key={emotion.name} className="flex items-center gap-4">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: expressionColors[emotion.name.toLowerCase() as keyof typeof expressionColors] || '#8884d8' }}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{emotion.name}</span>
                  <span className="text-muted-foreground">
                    {(emotion.score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full mt-1">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${emotion.score * 100}%`,
                      backgroundColor: expressionColors[emotion.name.toLowerCase() as keyof typeof expressionColors] || '#8884d8'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 