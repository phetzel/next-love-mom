"use client";

import { useState } from "react";
import { Shuffle, List } from "lucide-react";
import { MemoryPlayer } from "@/components/memory/memory-player";
import { MemoryList } from "@/components/memory/memory-list";
import { Button } from "@/components/ui/button";
import { Vault, Memory } from "@/types";

interface VaultPageContentProps {
  vault: Vault;
  memories: Memory[];
}

export default function VaultPageContent({
  vault,
  memories,
}: VaultPageContentProps) {
  const [showList, setShowList] = useState(true);
  const [currentMemory, setCurrentMemory] = useState<Memory>(memories[0]);

  const playRandomMemory = () => {
    if (memories.length === 0) return;
    const randomIndex = Math.floor(Math.random() * memories.length);
    setCurrentMemory(memories[randomIndex]);
  };

  if (memories.length === 0) {
    return <div>No memories found in this vault</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          {vault.name}
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
            <MemoryPlayer
              memory={currentMemory}
              autoPlay={false}
              vaultId={vault.id}
              isVaultOwner={true}
            />
          </div>
          {showList && (
            <div className="w-full md:w-1/3">
              <MemoryList
                memories={memories}
                onSelect={setCurrentMemory}
                vaultId={vault.id}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
