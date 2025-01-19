import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemoryPlayer } from "@/components/memory/memory-player";
import { Memory } from "@/types";

interface MemoryViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  memory?: Memory;
}

export function MemoryViewDialog({
  isOpen,
  onOpenChange,
  memory,
}: MemoryViewDialogProps) {
  if (!memory) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{memory.title}</DialogTitle>
        </DialogHeader>
        <MemoryPlayer memory={memory} />
      </DialogContent>
    </Dialog>
  );
}
