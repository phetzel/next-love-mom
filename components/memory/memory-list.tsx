import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DownloadAllButton } from "@/components/vault/download-all-button";
import { Memory } from "@/types";

interface MemoryListProps {
  memories: Memory[];
  onSelect: (memory: Memory) => void;
  vaultId: number;
}

export function MemoryList({ memories, onSelect, vaultId }: MemoryListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-20rem)] rounded-md border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4">Memory List</h2>
        <DownloadAllButton
          vaultId={vaultId}
          isDisabled={memories.length === 0}
        />
      </div>
      <div className="space-y-2">
        {memories.map((memory) => (
          <Button
            key={memory.id}
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => onSelect(memory)}
          >
            {memory.title}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
