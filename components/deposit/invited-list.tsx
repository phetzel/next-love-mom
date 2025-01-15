"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AddContributorDialog } from "@/components/dialog/add-contributor-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cancelInvitation } from "@/app/actions/invitation";
import { Invite } from "@/types";

interface InvitedListProps {
  vaultId: number;
  invitations: Invite[];
}

export function InvitedList({ invitations, vaultId }: InvitedListProps) {
  const [isListVisible, setIsListVisible] = useState<boolean>(false);
  const router = useRouter();

  const handleCancelInvitation = async (invitationId: number) => {
    await cancelInvitation(invitationId);
    router.refresh();
  };

  const activeInvitations = invitations.filter(
    (invite) => invite.status !== "rejected"
  ).length;
  const MAX_INVITES = 5;
  const canInvite = activeInvitations < MAX_INVITES;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Invites ({activeInvitations}/{MAX_INVITES})
          </CardTitle>

          <div className="flex space-x-2">
            <AddContributorDialog vaultId={vaultId} disabled={!canInvite} />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsListVisible(!isListVisible)}
            >
              {isListVisible ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isListVisible && (
        <CardContent>
          {!invitations.length ? (
            <p className="text-sm text-muted-foreground text-center">
              No pending invitations
            </p>
          ) : (
            <ScrollArea className="h-[200px]">
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-2 mb-2 rounded-lg bg-secondary"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {invite.inviteName}
                    </span>
                    <span className="text-sm font-medium">{invite.email}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {invite.status}
                    </span>
                  </div>

                  {invite.status === "pending" && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCancelInvitation(invite.id)}
                      className="transition-colors duration-200 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
}
