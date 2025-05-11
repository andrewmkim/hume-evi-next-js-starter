"use client";

import { useState, useEffect, useRef } from "react";
import Chat, { ChatHandle } from "@/components/ui/Chat";
import { useRouter } from "next/navigation";
import { VoiceProvider } from "@humeai/voice-react";
import { supabase } from "@/lib/supabaseClient";

export default function SessionPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const chatRef = useRef<ChatHandle | null>(null);

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

  const handleEndSession = async (sessionData: any) => {
    // Save to Supabase
    const { error } = await supabase.from("sessions").insert([
      {
        date: sessionData.date,
        conversation: sessionData.conversation,
        averaged_emotions: sessionData.averagedEmotions,
        // Add other fields as needed (summary, notes, etc.)
      }
    ]);
    if (error) {
      console.error("Error saving session to Supabase:", error);
      // Optionally show an error to the user
    }
    router.push("/results");
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center">
        <div className="text-2xl font-bold mb-2">Tell me about your day.</div>
      </div>
      {accessToken && (
        <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
          <Chat ref={chatRef} onEndSession={handleEndSession} />
        </VoiceProvider>
      )}
    </div>
  );
} 