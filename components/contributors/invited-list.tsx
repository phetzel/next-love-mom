import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InvitedListProps {
  invitations: {
    id: number;
    email: string;
    status: "pending" | "accepted" | "rejected";
  }[];
  onCancelInvite?: (id: number) => void;
}

export function InvitedList({ invitations, onCancelInvite }: InvitedListProps) {
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
              {invitation.status === "pending" && onCancelInvite && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCancelInvite(invitation.id)}
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
