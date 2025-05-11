declare module '@humeai/voice-react' {
  interface ProsodyScores {
    [key: string]: number;
  }

  interface ProsodyModel {
    scores: ProsodyScores;
  }

  interface TranscriptionModel {
    text: string;
    confidence: number;
  }

  interface Models {
    prosody: ProsodyModel;
    transcription?: TranscriptionModel;
  }

  interface BaseMessage {
    receivedAt: Date;
  }

  interface JSONMessage extends BaseMessage {
    models: Models;
  }

  interface ConnectionMessage extends BaseMessage {
    type: string;
  }

  type VoiceMessage = JSONMessage | ConnectionMessage;

  interface VoiceProviderProps {
    children: React.ReactNode;
    auth?: {
      type: "accessToken";
      value: string;
    };
    onMessage?: (message: VoiceMessage) => void;
  }

  export function useVoice(): {
    connect: () => Promise<void>;
    disconnect: () => void;
    status: { value: string };
    isMuted: boolean;
    mute: () => void;
    unmute: () => void;
    messages: VoiceMessage[];
  };

  export const VoiceProvider: React.FC<VoiceProviderProps>;
} 