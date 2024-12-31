"use client";

import { useState } from "react";
import { Shuffle, List } from "lucide-react";

import { MemoryPlayer } from "@/components/memory/memory-player";
import { MemoryList } from "@/components/memory/memory-list";
import { Button } from "@/components/ui/button";
import { Memory } from "@/types";

export default function VaultPage() {
  const memories: Memory[] = [];
  const [currentMemory, setCurrentMemory] = useState(memories[0]);
  const [showList, setShowList] = useState(false);

  const playRandomMemory = () => {
    const randomIndex = Math.floor(Math.random() * memories.length);
    setCurrentMemory(memories[randomIndex]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Memory Vault
        </h1>

        <div className="flex justify-center space-x-4 mb-8">
          <Button onClick={playRandomMemory} className="flex items-center">
            <Shuffle className="mr-2 h-4 w-4" /> Play Random Memory
          </Button>
          <Button
            onClick={() => setShowList(!showList)}
            variant="outline"
            className="flex items-center"
          >
            <List className="mr-2 h-4 w-4" /> {showList ? "Hide" : "Show"}{" "}
            Memory List
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <MemoryPlayer memory={currentMemory} />
          </div>
          {showList && (
            <div className="w-full md:w-1/3">
              <MemoryList memories={memories} onSelect={setCurrentMemory} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
