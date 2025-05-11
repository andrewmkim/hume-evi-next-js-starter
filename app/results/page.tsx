"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const emotionLabels = {
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

const emotionColors = {
  contemplation: "#7c3aed",
  satisfaction: "#a21caf",
  elation: "#f59e42",
  interest: "#2563eb",
  concentration: "#6366f1",
  determination: "#f43f5e",
  confusion: "#fbbf24",
  sadness: "#64748b",
  amusement: "#a3e635",
  realization: "#06b6d4",
  distress: "#ef4444",
  surprise: "#f472b6",
  doubt: "#94a3b8",
  disappointment: "#a8a29e"
};

const getLatestSession = () => {
  if (typeof window === "undefined") return null;
  const history = JSON.parse(localStorage.getItem("voiceVitalsSessions") || "[]");
  return history.length > 0 ? history[history.length - 1] : null;
};

export default function ResultsPage() {
  const router = useRouter();
  const [showTranscript, setShowTranscript] = useState(false);
  const [notes, setNotes] = useState("");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [session, setSession] = useState<any>(null);
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string>("");

  useEffect(() => {
    const s = getLatestSession();
    setSession(s);
    if (s) {
      setLoadingSummary(true);
      setSummaryError("");
      // Build transcript from actual conversation
      const transcript = s.conversation
        .map((msg: any) => `${msg.role === "user" ? "You" : "VoiceVitals"}: ${msg.text}`)
        .join("\n");
      // Get top 5 emotions
      const emotions = Object.fromEntries(
        Object.entries(s.averagedEmotions || {})
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 5)
      );
      fetch("/api/analyze-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, emotions })
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
          return res.json();
        })
        .then((data) => {
          setSummary(data.summary);
          setLoadingSummary(false);
        })
        .catch((err) => {
          setSummaryError("Could not generate summary.");
          setLoadingSummary(false);
        });
    }
  }, []);

  if (!session) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-4">Your Emotional Expression Analysis</h1>
        <p className="text-muted-foreground">No session data available.</p>
        <button className="mt-4 px-4 py-2 rounded bg-primary text-white font-semibold" onClick={() => router.push("/session")}>Start New Session</button>
      </div>
    );
  }

  const emotionData = Object.entries(session.averagedEmotions || {}).map(([key, value]) => ({
    emotion: emotionLabels[key as keyof typeof emotionLabels] || key,
    value: Number(value) * 100
  }));

  // Prepare data for line chart
  const getEmotionProgressionData = () => {
    if (!session?.conversation) return [];
    
    return session.conversation
      .filter((msg: any) => msg.role === "user" && msg.emotions)
      .map((msg: any, index: number) => {
        const data: any = { messageIndex: index + 1 };
        Object.entries(msg.emotions).forEach(([emotion, score]) => {
          data[emotionLabels[emotion as keyof typeof emotionLabels] || emotion] = Number(score) * 100;
        });
        return data;
      });
  };

  const emotionProgressionData = getEmotionProgressionData();
  const topEmotions = Object.entries(session?.averagedEmotions || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([emotion]) => emotionLabels[emotion as keyof typeof emotionLabels] || emotion);

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <button className="mb-4 text-sm text-muted-foreground" onClick={() => router.push("/session")}>{"< New Check-In"}</button>
      <h1 className="text-3xl font-bold mb-2">Your Emotional Expression Analysis</h1>
      <div className="mb-6 text-muted-foreground">Analysis from {session ? new Date(session.date).toLocaleDateString() : "-"}</div>
      
      {/* Emotional Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(session.averagedEmotions || {})
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 8)
          .map(([emotion, score]) => {
            const scoreValue = Number(score) * 100;
            return (
              <div 
                key={emotion} 
                className="bg-card rounded-lg p-4 border hover:border-primary/50 transition-all duration-300"
                style={{ borderLeft: `4px solid ${emotionColors[emotion as keyof typeof emotionColors] || '#8884d8'}` }}
              >
                <div className="text-sm font-medium mb-1">
                  {emotionLabels[emotion as keyof typeof emotionLabels] || emotion}
                </div>
                <div 
                  className="text-2xl font-bold"
                  style={{ color: emotionColors[emotion as keyof typeof emotionColors] || '#8884d8' }}
                >
                  {scoreValue.toFixed(1)}%
                </div>
                <div className="w-full bg-muted h-1 rounded-full mt-2">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${scoreValue}%`,
                      backgroundColor: emotionColors[emotion as keyof typeof emotionColors] || '#8884d8'
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {/* Therapeutic Analysis */}
      <div className="bg-card rounded-lg p-6 border mb-8">
        <h2 className="font-semibold mb-4">Therapeutic Analysis</h2>
        {loadingSummary ? (
          <div className="mb-4 text-muted-foreground">Generating analysis...</div>
        ) : summaryError ? (
          <div className="mb-4 text-red-500">{summaryError}</div>
        ) : (
          <div className="space-y-4">
            {summary.split('\n').map((section, index) => {
              if (section.startsWith('1.') || section.startsWith('2.') || section.startsWith('3.')) {
                const [title, ...content] = section.split(':');
                return (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">{content.join(':').trim()}</p>
                  </div>
                );
              }
              return <p key={index} className="text-sm text-muted-foreground">{section}</p>;
            })}
          </div>
        )}
        <div className="flex gap-2 mb-4 mt-6">
          <button className="px-3 py-1 rounded border text-sm hover:bg-muted transition-colors" onClick={() => setShowTranscript((v) => !v)}>
            {showTranscript ? "Hide Transcript" : "Show Transcript"}
          </button>
        </div>
        {showTranscript && (
          <div className="bg-muted rounded p-3 text-xs mb-4 max-h-40 overflow-y-auto">
            {session?.conversation?.map((msg: any, i: number) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className={msg.role === "user" ? "text-right" : "text-left"}>
                  <span className="font-bold mr-2">{msg.role === "user" ? "You" : "VoiceVitals"}:</span>
                  <span>{msg.text}</span>
                </div>
                {msg.role === "user" && msg.emotions && (
                  <div className="mt-2 flex flex-wrap gap-1 justify-end">
                    {Object.entries(msg.emotions)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([emotion, score]) => {
                        const scoreValue = Number(score) * 100;
                        return (
                          <span
                            key={emotion}
                            className="inline-block px-2 py-0.5 rounded-full text-[10px] transition-colors hover:bg-primary/20"
                            style={{ 
                              backgroundColor: `${emotionColors[emotion as keyof typeof emotionColors] || '#8884d8'}20`,
                              color: emotionColors[emotion as keyof typeof emotionColors] || '#8884d8'
                            }}
                            title={`${emotionLabels[emotion as keyof typeof emotionLabels] || emotion}: ${scoreValue.toFixed(1)}%`}
                          >
                            {emotionLabels[emotion as keyof typeof emotionLabels] || emotion}: {scoreValue.toFixed(0)}%
                          </span>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <label className="block font-semibold mb-1">Personal Reflection</label>
          <textarea
            className="w-full border rounded p-2 text-sm mb-2 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            rows={3}
            placeholder="How are you feeling about these insights? Record your thoughts here..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          <button className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-primary/90 transition-colors" onClick={() => alert("Reflection saved!")}>Save Reflection</button>
        </div>
      </div>

      {/* Full Width Chart */}
      <div className="bg-card rounded-lg p-6 border mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold">Emotional Expression Analysis</h3>
            <div className="text-xs text-muted-foreground">
              {chartType === "line" 
                ? "How your emotions evolved throughout the conversation"
                : "Overall emotional expression based on acoustic patterns"}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded transition-colors ${chartType === "line" ? "bg-primary text-white" : "bg-background hover:bg-muted"}`}
              onClick={() => setChartType("line")}
            >
              Emotion Progression
            </button>
            <button
              className={`px-3 py-1 rounded transition-colors ${chartType === "bar" ? "bg-primary text-white" : "bg-background hover:bg-muted"}`}
              onClick={() => setChartType("bar")}
            >
              Overall Emotions
            </button>
          </div>
        </div>
        <div className="h-[400px]">
          {chartType === "line" ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emotionProgressionData}>
                <XAxis 
                  dataKey="messageIndex" 
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  label={{ 
                    value: 'Message Sequence', 
                    position: 'insideBottom', 
                    offset: -5,
                    fill: "#9CA3AF"
                  }}
                />
                <YAxis 
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  label={{ 
                    value: 'Emotion Intensity', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: "#9CA3AF"
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#F3F4F6"
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                  labelFormatter={(label) => `Message ${label}`}
                />
                <Legend />
                {topEmotions.map((emotion, index) => (
                  <Line
                    key={emotion}
                    type="monotone"
                    dataKey={emotion}
                    stroke={emotionColors[emotion.toLowerCase() as keyof typeof emotionColors] || '#8884d8'}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1000}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionData}>
                <XAxis 
                  dataKey="emotion" 
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#F3F4F6"
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8"
                  animationDuration={1000}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <button
        className="w-full mt-4 border rounded py-2 text-center text-muted-foreground text-sm hover:bg-muted transition-colors"
        onClick={() => router.push("/trends")}
      >
        <span className="mr-2">📊</span>View Emotional Trends Over Time
      </button>
    </div>
  );
} 