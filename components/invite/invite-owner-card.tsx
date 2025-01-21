import { Crown, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteOwnerDialog } from "@/components/invite/invite-owner-dialog";
import { Vault } from "@/types";

interface InviteOwnerCardProps {
  memoryCount: number;
  vault: Vault;
}

export function InviteOwnerCard({ vault, memoryCount }: InviteOwnerCardProps) {
  const {
    id: vaultId,
    isOwnerClaimed,
    isOwnerInvited,
    ownerName,
    ownerEmail,
  } = vault;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="mr-2 h-5 w-5 text-yellow-500" />
          Vault Ownership
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isOwnerClaimed ? (
          <div>
            <p className="font-semibold">This vault is owned by:</p>
            <p>{ownerName}</p>
            <p className="text-sm text-muted-foreground">{ownerEmail}</p>
          </div>
        ) : isOwnerInvited ? (
          <div>
            <p className="font-semibold flex items-center">
              <Clock className="mr-2 h-4 w-4 text-blue-500" />
              Ownership invitation pending
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Sent to: {ownerEmail}
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-2">{`${ownerName?.length ? ownerName : "Owner"} has not been invited yet.`}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Current memory count: {memoryCount}
            </p>

            {memoryCount > 0 && <InviteOwnerDialog vaultId={vaultId} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
