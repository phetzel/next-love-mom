"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadMemoryButton } from "@/components/memory/download-memory-button";
import { Memory } from "@/types";

interface MemoryPlayerProps {
  memory: Memory | null;
  autoPlay?: boolean;
  vaultId?: number;
  isVaultOwner?: boolean;
}

export function MemoryPlayer({
  memory,
  autoPlay = false,
  vaultId,
  isVaultOwner = false,
}: MemoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const showDownloadButton = vaultId !== undefined && isVaultOwner;

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">{memory.title}</h3>

            {/* Only show download button in vault context for vault owners */}
            {showDownloadButton && (
              <DownloadMemoryButton vaultId={vaultId!} memoryId={memory.id} />
            )}
          </div>

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
