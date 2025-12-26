// lib/hooks/useTextToSpeech.ts
"use client";

import { useState, useEffect, useRef } from "react";

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  voices: SpeechSynthesisVoice[];
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn {
  const { rate = 1, pitch = 1, volume = 1, voice = null } = options;
  
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      // Load voices immediately if available
      loadVoices();
      
      // Also listen for voices changed event (some browsers load voices asynchronously)
      speechSynthesis.addEventListener("voiceschanged", loadVoices);
      
      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);

  const speak = (text: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  };

  const pause = () => {
    if (isSupported && isPlaying && !isPaused) {
      speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (isSupported && isPlaying && isPaused) {
      speechSynthesis.resume();
    }
  };

  return {
    speak,
    stop,
    pause,
    resume,
    isSupported,
    isPlaying,
    isPaused,
    voices,
  };
}
