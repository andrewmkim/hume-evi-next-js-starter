"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckIn() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const router = useRouter();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await processRecording(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);

      // Stop recording after 30 seconds
      setTimeout(() => {
        if (mediaRecorder.current?.state === "recording") {
          stopRecording();
        }
      }, 30000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('files', audioBlob, 'recording.wav');
      formData.append('models', JSON.stringify({ voice: {} }));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze recording');
      }

      const data = await response.json();
      router.push(`/results?jobId=${data.jobId}`);
    } catch (error) {
      console.error("Error processing recording:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Voice Check-In</h1>
        <p className="text-lg text-muted-foreground">
          {isRecording 
            ? "Recording your voice journal entry..."
            : "Record a 30-second voice journal entry to analyze your emotional state"}
        </p>
        
        <div className="flex justify-center">
          {isProcessing ? (
            <Button disabled size="lg" className="gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </Button>
          ) : isRecording ? (
            <Button 
              onClick={stopRecording} 
              variant="destructive" 
              size="lg" 
              className="gap-2"
            >
              <Square className="h-5 w-5" />
              Stop Recording
            </Button>
          ) : (
            <Button 
              onClick={startRecording} 
              size="lg" 
              className="gap-2"
            >
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          )}
        </div>

        {isRecording && (
          <div className="text-sm text-muted-foreground">
            Recording will automatically stop after 30 seconds
          </div>
        )}
      </div>
    </div>
  );
} 