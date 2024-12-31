import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Memory } from "@/types";

interface MemoryListProps {
  memories: Memory[];
  onSelect: (memory: Memory) => void;
}

export function MemoryList({ memories, onSelect }: MemoryListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-20rem)] rounded-md border p-4">
      <h2 className="text-2xl font-semibold mb-4">Memory List</h2>
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
