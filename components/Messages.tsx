"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef } from "react";

// Type guards for Hume message types
function isUserMessage(msg: any): msg is { type: string; message: { content: string }; models: { prosody?: { scores?: Record<string, number> } } } {
  return msg && msg.type === "user_message" && msg.message && typeof msg.message.content === "string" && msg.models;
}
function isAssistantMessage(msg: any): msg is { type: string; message: { content: string } } {
  return msg && msg.type === "assistant_message" && msg.message && typeof msg.message.content === "string";
}

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(_, ref) {
  const { messages } = useVoice();

  // Filter to ensure only one assistant response per user message
  const filteredMessages = [];
  let lastWasUser = false;
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (isUserMessage(msg)) {
      filteredMessages.push(msg);
      lastWasUser = true;
    } else if (isAssistantMessage(msg)) {
      if (lastWasUser) {
        filteredMessages.push(msg);
        lastWasUser = false;
      }
    }
  }

  return (
    <motion.div
      layoutScroll
      className={"grow rounded-md overflow-auto p-4"}
      ref={ref}
    >
      <motion.div
        className={"max-w-2xl mx-auto w-full flex flex-col gap-4 pb-24"}
      >
        <AnimatePresence mode={"popLayout"}>
          {filteredMessages.map((msg, index) => {
            if (isUserMessage(msg) || isAssistantMessage(msg)) {
              return (
                <motion.div
                  key={msg.type + index}
                  className={cn(
                    "w-[80%]",
                    "bg-card",
                    "border border-border rounded",
                    isUserMessage(msg) ? "ml-auto" : ""
                  )}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                  }}
                >
                  <div
                    className={cn(
                      "text-xs capitalize font-medium leading-none opacity-50 pt-4 px-3"
                    )}
                  >
                    {isAssistantMessage(msg) ? "VoiceVitals" : "You"}
                  </div>
                  <div className={"pb-3 px-3"}>{msg.message.content}</div>
                  {isUserMessage(msg) && <Expressions values={{ ...msg.models?.prosody?.scores }} />}
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;
