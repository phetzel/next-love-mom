"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cancelInvitation } from "@/app/actions/invitation";
import { Invite } from "@/types";

export default function DepositPageContent({
  invitations,
}: {
  invitations: Invite[];
}) {
  const router = useRouter();

  const handleCancelInvitation = async (invitationId: number) => {
    await cancelInvitation(invitationId);
    router.refresh();
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Pending Invitations</h3>
      <ul className="space-y-3">
        {invitations.map((invite) => (
          <li
            key={invite.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
          >
            <span>{invite.email}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCancelInvitation(invite.id)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
        {invitations.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No pending invitations
          </p>
        )}
      </ul>
    </div>
  );
}
