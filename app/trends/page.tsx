"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const allEmotions = [
  "Contemplation", "Satisfaction", "Elation", "Interest", "Concentration", "Determination", "Confusion", "Sadness", "Amusement", "Realization", "Distress", "Surprise", "Doubt", "Disappointment"
];

const emotionColors: Record<string, string> = {
  Contemplation: "#7c3aed",
  Satisfaction: "#a21caf",
  Elation: "#f59e42",
  Interest: "#2563eb",
  Concentration: "#6366f1",
  Determination: "#f43f5e",
  Confusion: "#fbbf24",
  Sadness: "#64748b",
  Amusement: "#a3e635",
  Realization: "#06b6d4",
  Distress: "#ef4444",
  Surprise: "#f472b6",
  Doubt: "#94a3b8",
  Disappointment: "#a8a29e"
};

const getAllSessions = () => {
  if (typeof window === "undefined") return [];
  const history = JSON.parse(localStorage.getItem("voiceVitalsSessions") || "[]");
  return history.length > 0 ? history : [];
};

function getPrimaryEmotion(averagedEmotions: Record<string, number>) {
  if (!averagedEmotions) return null;
  const sorted = Object.entries(averagedEmotions).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;
  // Capitalize first letter
  return sorted[0][0].charAt(0).toUpperCase() + sorted[0][0].slice(1);
}

export default function TrendsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(["Contemplation", "Satisfaction", "Elation", "Interest", "Concentration", "Determination", "Amusement"]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [timeRange] = useState("Past Week"); // Placeholder for future filter

  useEffect(() => {
    setSessions(getAllSessions());
  }, []);

  // Prepare data for the trend chart
  const chartData = sessions.map((s) => {
    const data: Record<string, any> = { date: new Date(s.date).toLocaleDateString() };
    if (s.averagedEmotions) {
      Object.entries(s.averagedEmotions).forEach(([key, value]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        data[label] = Number(value) * 100;
      });
    }
    return data;
  }).reverse(); // Most recent last

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Emotion Trends</h1>
        <select className="border rounded px-2 py-1 text-sm" value={timeRange} disabled>
          <option>Past Week</option>
        </select>
      </div>
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            {selectedEmotions.map((emotion) => (
              <Line
                key={emotion}
                type="monotone"
                dataKey={emotion}
                stroke={emotionColors[emotion] || "#8884d8"}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Emotions to Display</div>
        <div className="flex flex-wrap gap-2">
          {allEmotions.map((emotion) => (
            <button
              key={emotion}
              className={`px-3 py-1 rounded-full border text-sm ${selectedEmotions.includes(emotion) ? "bg-primary text-white" : "bg-background text-primary"}`}
              style={{ borderColor: emotionColors[emotion] || "#8884d8" }}
              onClick={() =>
                setSelectedEmotions((prev) =>
                  prev.includes(emotion)
                    ? prev.filter((e) => e !== emotion)
                    : [...prev, emotion]
                )
              }
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Recent Check-ins</div>
        <div className="space-y-3">
          {sessions.length === 0 && <div className="text-muted-foreground">No check-ins yet.</div>}
          {sessions.map((s, i) => {
            const primaryEmotion = getPrimaryEmotion(s.averagedEmotions);
            return (
              <div key={i} className="border rounded-lg">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div>
                    <div className="font-semibold">{new Date(s.date).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Primary emotion: {primaryEmotion || "-"}</div>
                  </div>
                  <span className="text-primary font-semibold text-sm flex items-center gap-1">
                    Transcript
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </button>
                {expanded === i && (
                  <div className="px-4 pb-4">
                    <div className="text-xs text-muted-foreground mb-2">Transcript</div>
                    <div className="bg-muted rounded p-3 text-xs max-h-40 overflow-y-auto">
                      {s.conversation?.map((msg: any, j: number) => (
                        <div key={j} className={msg.role === "user" ? "text-right" : "text-left"}>
                          <span className="font-bold mr-2">{msg.role === "user" ? "You" : "VoiceVitals"}:</span>
                          <span>{msg.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button className="px-4 py-2 rounded bg-primary text-white font-semibold" onClick={() => router.push("/")}>Home</button>
        <button className="px-4 py-2 rounded bg-secondary text-primary font-semibold" onClick={() => router.push("/results")}>Latest Results</button>
      </div>
    </div>
  );
} 