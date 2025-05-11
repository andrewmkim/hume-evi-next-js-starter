"use client";

import { type VoiceMessage } from "@humeai/voice-react";
import { Card } from "./ui/card";
import { expressionLabels } from "@/utils/expressionLabels";
import { expressionColors } from "@/utils/expressionColors";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EmotionDataPoint {
  timestamp: number;
  [key: string]: number;
}

interface EmotionHistoryProps {
  messages: VoiceMessage[];
}

export default function EmotionHistory({ messages }: EmotionHistoryProps) {
  const getEmotionHistory = (): EmotionDataPoint[] => {
    if (!messages || messages.length === 0) return [];

    return messages
      .map(msg => {
        if (!msg || typeof msg !== 'object' || !('models' in msg) || !msg.models?.prosody?.scores) return null;
        const timestamp = new Date(msg.receivedAt).getTime();
        const scores = msg.models.prosody.scores;
        return {
          timestamp,
          ...Object.entries(scores).reduce((acc, [key, value]) => ({
            ...acc,
            [expressionLabels[key as keyof typeof expressionLabels] || key]: Number(value)
          }), {})
        };
      })
      .filter(Boolean) as EmotionDataPoint[];
  };

  const emotionHistory = getEmotionHistory();
  if (emotionHistory.length === 0) return null;

  // Get the top 3 emotions to display
  const topEmotions = Object.keys(emotionHistory[0])
    .filter(key => key !== 'timestamp')
    .sort((a, b) => {
      const avgA = emotionHistory.reduce((sum, point) => sum + (point[a] || 0), 0) / emotionHistory.length;
      const avgB = emotionHistory.reduce((sum, point) => sum + (point[b] || 0), 0) / emotionHistory.length;
      return avgB - avgA;
    })
    .slice(0, 3);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Emotional Journey</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={emotionHistory}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']}
            />
            {topEmotions.map((emotion, index) => (
              <Line
                key={emotion}
                type="monotone"
                dataKey={emotion}
                stroke={expressionColors[emotion.toLowerCase() as keyof typeof expressionColors] || '#8884d8'}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-4 justify-center">
        {topEmotions.map(emotion => (
          <div key={emotion} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: expressionColors[emotion.toLowerCase() as keyof typeof expressionColors] || '#8884d8' }}
            />
            <span className="text-sm">{emotion}</span>
          </div>
        ))}
      </div>
    </Card>
  );
} 