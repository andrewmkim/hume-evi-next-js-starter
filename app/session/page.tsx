"use client";

import { useState, useEffect } from "react";
import Chat, { ChatHandle } from "@/components/ui/Chat";
import { useRouter } from "next/navigation";
import { VoiceProvider } from "@humeai/voice-react";

export default function SessionPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  // Automatically fetch access token and start session on mount
  useEffect(() => {
    let isMounted = true;
    const fetchToken = async () => {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'start' }),
      });
      if (response.ok && isMounted) {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
      }
    };
    fetchToken();
    return () => { isMounted = false; };
  }, []);

  const handleEndSession = (sessionData: any) => {
    const history = JSON.parse(localStorage.getItem("voiceVitalsSessions") || "[]");
    history.push(sessionData);
    localStorage.setItem("voiceVitalsSessions", JSON.stringify(history));
    router.push("/results");
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center">
        <div className="text-2xl font-bold mb-2">Tell me about your day.</div>
      </div>
      {accessToken && (
        <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
          <Chat onEndSession={handleEndSession} />
        </VoiceProvider>
      )}
    </div>
  );
} 