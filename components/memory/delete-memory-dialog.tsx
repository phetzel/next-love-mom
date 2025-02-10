import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DeleteMemoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
}

export function DeleteMemoryDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
}: DeleteMemoryDialogProps) {
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast({
        title: "Success",
        description: "Memory deleted successfully",
      });
    } catch (error) {
      console.error("Failed to create vault:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete memory",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Memory</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{title}&quot;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
