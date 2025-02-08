"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { inviteOwner } from "@/app/actions/invitation";

interface InviteOwnerDialogProps {
  vaultId: number;
}

export function InviteOwnerDialog({ vaultId }: InviteOwnerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function onSubmit() {
    try {
      await inviteOwner(vaultId);
      setIsOpen(false);

      toast({
        title: "Invitation sent",
        description: `An ownership invitation has been sent to the owner of the vault.`,
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to create vault:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Invite Owner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Vault Owner</DialogTitle>
          <DialogDescription>
            Send an invitation to the owner of the vault
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
