"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">VoiceVitals+</h1>
      <p className="mb-8 text-lg text-muted-foreground text-center max-w-xl">
        VoiceVitals+ is your voice-based journaling companion. Speak freely, get emotional insights, and track your well-being over time.
      </p>
      <button
        className="px-6 py-3 rounded bg-primary text-white font-semibold text-lg shadow-lg hover:bg-primary/90 transition"
        onClick={() => router.push("/session")}
      >
        Log today’s journal entry
      </button>
    </div>
  );
}
