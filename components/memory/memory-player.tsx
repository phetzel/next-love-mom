"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Memory } from "@/types";

interface MemoryPlayerProps {
  memory: Memory;
}

export function MemoryPlayer({ memory }: MemoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  console.log("MemoryPlayerProps", memory);

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
