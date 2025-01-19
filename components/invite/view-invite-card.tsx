"use client";

import { Sparkles, UserPlus, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

// import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { acceptInvitation, rejectInvitation } from "@/app/actions/invitation";
import { Invite } from "@/types";

interface ViewInviteCardProps {
  currentInvite: Invite;
}

export function ViewInviteCard({ currentInvite }: ViewInviteCardProps) {
  const router = useRouter();

  const handleAccept = async (id: number) => {
    // Accept the invite
    try {
      const invite = await acceptInvitation(id);
      // toast.success("Invitation accepted");
      const path =
        invite.data.type === "contributor"
          ? `/dashboard/deposit/${invite.data.vaultId}`
          : `/dashboard/vault/${invite.data.vaultId}`;

      router.push(path);
    } catch (error) {
      console.error(error);
      // toast.error(error.message)
    }
  };

  const handleDecline = async (id: number) => {
    // Accept the invite
    try {
      await rejectInvitation(id);
      // toast.success("Invitation accepted");
      router.refresh();
    } catch (error) {
      console.error(error);
      // toast.error(error.message)
    }
  };

  return (
    <Card className="mt-4 overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-4">
          {currentInvite.type === "owner" ? (
            <Crown className="h-12 w-12 text-yellow-500" />
          ) : (
            <UserPlus className="h-12 w-12 text-blue-500" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">
          {/* {currentInvite.vaultName} */} vaultName
        </h3>
        <p className="text-center text-muted-foreground mb-4">
          {/* From: {currentInvite.senderName} */} senderName
        </p>
        <p className="text-center">
          {currentInvite.type === "owner"
            ? "You've been invited to be an owner of this memory vault."
            : "You've been invited to contribute to this memory vault."}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between space-x-2 bg-muted/50 p-6">
        <Button
          variant="outline"
          onClick={() => handleDecline(currentInvite.id)}
        >
          Decline
        </Button>
        <Button
          onClick={() => handleAccept(currentInvite.id)}
          className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:from-pink-600 hover:to-yellow-600"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
}
