"use server";

import { db } from "@/lib/db/drizzle";
import { invitations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { isUserCreator, isUserOwner } from "@/lib/db/queries";

export async function inviteContributor(vaultId: number, email: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const isCreator = await isUserCreator(vaultId, userId);
  const isOwner = await isUserOwner(vaultId, userId);
  if (!isCreator && !isOwner) {
    throw new Error("Not authorized to invite contributors");
  }

  await db.insert(invitations).values({
    email,
    vaultId,
    invitorId: userId,
    type: "contributor",
    status: "pending",
  });
}

export async function cancelInvitation(invitationId: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.id, invitationId),
  });

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  const isCreator = await isUserCreator(invitation.vaultId, userId);
  const isOwner = await isUserOwner(invitation.vaultId, userId);
  if (!isCreator && !isOwner) {
    throw new Error("Not authorized to cancel this invitation");
  }

  await db.delete(invitations).where(eq(invitations.id, invitationId));
}
