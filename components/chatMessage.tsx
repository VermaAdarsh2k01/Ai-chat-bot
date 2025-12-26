"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Sender = "user" | "ai";
import { Button } from "@/components/ui/button";
import { Bot, User, Headset, Volume2, VolumeX, Pause, Play } from "lucide-react";
import { useTextToSpeech } from "@/lib/hooks/useTextToSpeech";

interface ChatMessageProps {
  sender: Sender;
  text: string;
  timestamp?: string;
}

export function ChatMessage({ sender, text, timestamp }: ChatMessageProps) {
  const isUser = sender === "user";
  const { speak, stop, pause, resume, isSupported, isPlaying, isPaused } = useTextToSpeech();

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <Avatar className={`h-8 w-8 ${isUser ? "bg-blue-500" : "bg-gray-700"}`}>
        <AvatarFallback>
          {isUser ? (
            <User className="h-4 w-4 text-blue-500" />
          ) : (
            <Headset className="h-4 w-4 text-blue-500" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* Message bubble */}
      <div
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[70%]`}
      >
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isUser
              ? "bg-blue-500 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-500 rounded-bl-sm"
          }`}
        >
          {/* TTS Controls - Only show for AI messages */}
          {!isUser && isSupported && (
            <div className="flex items-center justify-start gap-1 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-200"
                onClick={() => {
                  if (isPlaying && !isPaused) {
                    pause();
                  } else if (isPlaying && isPaused) {
                    resume();
                  } else if (!isPlaying) {
                    speak(text);
                  }
                }}
                title={
                  isPlaying && !isPaused
                    ? "Pause speech"
                    : isPlaying && isPaused
                    ? "Resume speech"
                    : "Play speech"
                }
              >
                {isPlaying && !isPaused ? (
                  <Pause className="h-3 w-3 text-gray-600" />
                ) : isPlaying && isPaused ? (
                  <Play className="h-3 w-3 text-gray-600" />
                ) : (
                  <Volume2 className="h-3 w-3 text-gray-600" />
                )}
              </Button>
              
              {/* Stop button - Only show when playing */}
              {isPlaying && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                  onClick={stop}
                  title="Stop speech"
                >
                  <VolumeX className="h-3 w-3 text-gray-600" />
                </Button>
              )}
            </div>
          )}
          
          {/* Message content */}
          <p className="text-sm whitespace-pre-wrap wrap-break-words leading-relaxed">
            {text}
          </p>
        </div>

        {timestamp && (
          <span className="text-xs text-gray-500 mt-1 px-1">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
