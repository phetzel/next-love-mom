"use client";

import { useRouter } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cancelInvitation } from "@/app/actions/invitation";
import { Invite } from "@/types";

interface InvitedListProps {
  invitations: Invite[];
}

export function InvitedList({ invitations }: InvitedListProps) {
  const router = useRouter();

  const handleCancelInvitation = async (invitationId: number) => {
    await cancelInvitation(invitationId);
    router.refresh();
  };

  if (!invitations.length) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground text-center">
          No pending invitations
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <ScrollArea className="h-[200px] p-4">
        <div className="space-y-2">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between p-2 rounded-lg bg-secondary"
            >
              <div className="flex flex-col">
                <span className="text-sm">{invitation.email}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {invitation.status}
                </span>
              </div>
              {invitation.status === "pending" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCancelInvitation(invitation.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
