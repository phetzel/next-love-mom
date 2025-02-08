"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Memory } from "@/types";

interface MemoryPlayerProps {
  memory: Memory | null;
  autoPlay?: boolean;
}

export function MemoryPlayer({ memory, autoPlay = false }: MemoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (memory && autoPlay && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [memory, autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!memory) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground">
            No memory selected
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <Image
            src={memory.imageUrl}
            alt={memory.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">{memory.title}</h2>
          <audio ref={audioRef} src={memory.audioUrl} className="hidden" />
          <Button onClick={togglePlay} className="w-full">
            {isPlaying ? (
              <Pause className="mr-2 h-4 w-4" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isPlaying ? "Pause" : "Play"} Audio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
