"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Mic, Play, Pause } from "lucide-react";
import Link from "next/link";

interface EmotionScore {
  name: string;
  score: number;
}

interface CheckInData {
  timestamp: number;
  emotions: EmotionScore[];
  audioUrl?: string;
  note?: string;
}

export default function Dashboard() {
  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckInData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("voiceVitalsHistory") || "[]");
    setCheckIns(history.sort((a: CheckInData, b: CheckInData) => b.timestamp - a.timestamp));
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmotionSummary = (emotions: EmotionScore[]) => {
    if (emotions.length === 0) return "";
    
    const topEmotions = emotions.slice(0, 3);
    const emotionNames = topEmotions.map(e => e.name.toLowerCase());
    
    if (emotionNames.length === 1) {
      return `You sounded ${emotionNames[0]}.`;
    } else if (emotionNames.length === 2) {
      return `You sounded ${emotionNames[0]} and ${emotionNames[1]}.`;
    } else {
      return `You sounded ${emotionNames[0]}, ${emotionNames[1]}, and ${emotionNames[2]}.`;
    }
  };

  const toggleAudio = (checkIn: CheckInData) => {
    if (selectedCheckIn?.timestamp === checkIn.timestamp) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (checkIn.audioUrl) {
        setSelectedCheckIn(checkIn);
        setIsPlaying(true);
        const audio = new Audio(checkIn.audioUrl);
        audio.play();
        audioRef.current = audio;
      }
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] p-4">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Your Emotional History</h1>
          <Link href="/checkin">
            <Button className="gap-2">
              <Mic className="h-4 w-4" />
              New Check-In
            </Button>
          </Link>
        </div>

        {checkIns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No check-ins yet. Start your first one!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {checkIns.map((checkIn) => (
              <div
                key={checkIn.timestamp}
                className="p-6 border rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {formatDate(checkIn.timestamp)}
                    </h2>
                    <p className="text-muted-foreground">
                      {getEmotionSummary(checkIn.emotions)}
                    </p>
                  </div>
                  {checkIn.audioUrl && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleAudio(checkIn)}
                    >
                      {isPlaying && selectedCheckIn?.timestamp === checkIn.timestamp ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>

                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={checkIn.emotions}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {checkIn.note && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Note:</strong> {checkIn.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 