"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ViewInviteCard } from "@/components/invite/view-invite-card";
import { InviteDetails } from "@/types";

interface ViewInvitesDialogProps {
  invites: InviteDetails[];
}

export function ViewInvitesDialog({ invites }: ViewInvitesDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentInvite = invites[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-white text-pink-500 hover:bg-pink-100 hover:text-pink-600 transition-colors"
        >
          View Invitations
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            You&apos;re Invited!
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          {currentInvite && (
            <div
              key={currentInvite.id}
              className="transform transition-all duration-300 ease-in-out animate-fade-in-up"
            >
              <ViewInviteCard currentInvite={currentInvite} />
            </div>
          )}
        </div>

        {invites.length > 1 && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % invites.length)
              }
              className="transition-shadow duration-300 ease-in-out hover:shadow-md"
            >
              Next Invitation
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
