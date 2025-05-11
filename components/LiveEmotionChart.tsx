"use client";
import { useVoice } from "@humeai/voice-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const emotionLabels: Record<string, string> = {
  contemplation: "Contemplation",
  satisfaction: "Satisfaction",
  elation: "Elation",
  interest: "Interest",
  concentration: "Concentration",
  determination: "Determination",
  confusion: "Confusion",
  sadness: "Sadness",
  amusement: "Amusement",
  realization: "Realization",
  distress: "Distress",
  surprise: "Surprise",
  doubt: "Doubt",
  disappointment: "Disappointment"
};

// Add a type guard for models
function isMessageWithModels(msg: any): msg is { models: { prosody: { scores: Record<string, number> } } } {
  return msg && typeof msg === 'object' && 'models' in msg && msg.models?.prosody?.scores;
}

export default function LiveEmotionChart() {
  const { messages } = useVoice();
  const latest = messages.length > 0 ? messages[messages.length - 1] : null;
  const scores = isMessageWithModels(latest) ? latest.models.prosody.scores : {};
  const data = Object.entries(scores).map(([key, value]) => ({
    emotion: emotionLabels[key] || key,
    value: Number(value) * 100
  }));

  return (
    <div className="bg-card rounded-lg p-6 border">
      <h2 className="font-semibold mb-4 text-lg">Live Emotional Expression</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="emotion" tick={{ fontSize: 14 }} interval={0} angle={-30} textAnchor="end" height={80} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 14 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 