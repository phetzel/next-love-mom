import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { VaultDetails } from "@/types";

interface VaultCardProps {
  vault: VaultDetails;
  isOwned: boolean;
}

export function VaultCard({ vault, isOwned }: VaultCardProps) {
  const {
    id,
    ownerEmail,
    name,
    memoryCount,
    owner,
    isOwnerClaimed,
    isOwnerInvited,
  } = vault;

  const renderOwnerInfo = () => {
    if (isOwned) return null;

    let status = "Unclaimed";
    let badgeVariant: "default" | "secondary" | "outline" = "outline";

    if (isOwnerClaimed) {
      status = "Claimed";
      badgeVariant = "default";
    } else if (isOwnerInvited) {
      status = "Pending";
      badgeVariant = "secondary";
    }

    return (
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground">
          Owner: {owner?.name || ownerEmail || "Unknown"}
        </span>
        <Badge variant={badgeVariant}>{status}</Badge>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isOwned && renderOwnerInfo()}
        <p className="mb-4 text-muted-foreground">Memories: {memoryCount}</p>
        <Button
          asChild
          className="w-full"
          variant={isOwned ? "default" : "secondary"}
        >
          <Link
            href={
              isOwned ? `/dashboard/vault/${id}` : `/dashboard/deposit/${id}`
            }
          >
            {isOwned ? "Open Vault" : "Add Memory"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
