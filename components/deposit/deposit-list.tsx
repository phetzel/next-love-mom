"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Memory } from "@/types";
import { DepositCard } from "@/components/deposit/deposit-card";
import { MemoryViewDialog } from "@/components/dialog/view-memory-dialog";

interface DepositListProps {
  memories: Memory[];
}

export function DepositList({ memories }: DepositListProps) {
  const [showList, setShowList] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const onDelete = (id: number) => {};
  const onEdit = (memory: Memory) => {};
  const onView = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  return (
    <div className="space-y-4 w-full mx-auto">
      <Button
        onClick={() => setShowList(!showList)}
        variant="outline"
        className="w-full max-w-xs transition-all duration-200 hover:bg-primary/10 hover:text-primary"
      >
        {showList ? "Hide" : "Show"} My Contributions
      </Button>

      {showList && (
        <div className="mt-4 space-y-4 max-w-md mx-auto animate-accordion-down transition-all duration-600 ease-in-out max-h-[600px] overflow-hidden">
          <h2 className="text-2xl font-semibold mb-4">My Contributions</h2>
          {memories.map((memory) => (
            <DepositCard
              key={memory.id}
              memory={memory}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <MemoryViewDialog
        isOpen={!!selectedMemory}
        onOpenChange={(open) => !open && setSelectedMemory(null)}
        memory={selectedMemory!}
      />
    </div>
  );
}
