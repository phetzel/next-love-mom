"use server";

import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";

import { env } from "@/lib/env";
import { db } from "@/lib/db/drizzle";
import { invitations } from "@/lib/db/schema";
import {
  addContributorToVault,
  setOwnerClaimed,
  setOwnerInvited,
} from "@/lib/db/mutations";
import { isUserCreator, isUserOwner, getVaultById } from "@/lib/db/queries";
import { InviteOwnerEmail } from "@/lib/email/emails/invite-owner";
import { InviteContributorEmail } from "@/lib/email/emails/invite-contributor";
import { getClerkImageUrl } from "@/lib/utils";

const resend = new Resend(env.RESEND_API_KEY);

// Invite request functions
export async function inviteContributor(
  vaultId: number,
  email: string,
  inviteName: string
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const vault = await getVaultById(vaultId);
  if (!vault) throw new Error("Vault not found");

  const isCreator = vault.creatorId === userId;
  const isOwner = vault.ownerId === userId;
  if (!isCreator && !isOwner) {
    throw new Error("Not authorized to invite contributors");
  }

  // Create a new invite
  const [invite] = await db
    .insert(invitations)
    .values({
      email,
      inviteName,
      vaultId,
      invitorId: userId,
      type: "contributor",
      status: "pending",
    })
    .returning();

  const inviteUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard`;

  try {
    const mail = await resend.emails.send({
      from: "Memory Vault <invite@mail.iloveyouforever.live>",
      to: [email],
      subject: `You've been invited to contribute to ${vault.name}`,
      react: InviteContributorEmail({
        inviteName: inviteName,
        inviteUrl,
        invitedByName: user.username ?? "Someone",
        invitedByEmail: user.primaryEmailAddress?.emailAddress ?? "",
        invitedByImageUrl: getClerkImageUrl(user.imageUrl),
        vaultName: vault.name,
      }),
    });

    if (!mail.data) {
      throw new Error("Failed to send email: " + mail.error);
    }

    return { success: true, inviteId: invite.id, mailId: mail.data };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send invitation email");
  }
}

// Invite request functions
export async function inviteOwner(vaultId: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const vault = await getVaultById(vaultId);
  if (!vault) throw new Error("Vault not found");

  const isCreator = vault.creatorId === userId;
  if (!isCreator) throw new Error("Not authorized to invite contributors");
  console.log("vault", vault);

  // Create a new invite
  const [invite] = await db
    .insert(invitations)
    .values({
      email: vault.ownerEmail,
      inviteName: vault.ownerName,
      vaultId,
      invitorId: userId,
      type: "owner",
      status: "pending",
    })
    .returning();

  const inviteUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard`;

  try {
    const mail = await resend.emails.send({
      from: "Memory Vault <invite@mail.iloveyouforever.live>",
      to: [vault.ownerEmail],
      subject: `You've been invited to ${vault.name}`,
      react: InviteOwnerEmail({
        inviteName: vault.ownerName || "New Vault Owner",
        inviteUrl,
        invitedByName: user.username ?? "Someone",
        invitedByEmail: user.primaryEmailAddress?.emailAddress ?? "",
        invitedByImageUrl: getClerkImageUrl(user.imageUrl),
        vaultName: vault.name,
      }),
    });

    if (!mail.data) {
      throw new Error("Failed to send email: " + mail.error);
    }

    await setOwnerInvited(vaultId);

    return { success: true, inviteId: invite.id, mailId: mail.data };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send invitation email");
  }
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

// Invite response functions
export async function acceptInvitation(invitationId: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }
  console.log("user", user);

  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.id, invitationId),
  });
  console.log("invitation", invitation);

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  if (invitation.email !== user.primaryEmailAddress?.emailAddress) {
    throw new Error("Not authorized to accept this invitation");
  }

  await db
    .update(invitations)
    .set({ status: "accepted" })
    .where(eq(invitations.id, invitationId));

  if (invitation.type === "contributor") {
    await addContributorToVault(invitation.vaultId, userId);
  } else if (invitation.type === "owner") {
    await setOwnerClaimed(invitation.vaultId);
  }

  return { success: true, data: invitation };
}

export async function rejectInvitation(invitationId: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.id, invitationId),
  });

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  if (invitation.email !== user.primaryEmailAddress?.emailAddress) {
    throw new Error("Not authorized to reject this invitation");
  }

  await db
    .update(invitations)
    .set({ status: "rejected" })
    .where(eq(invitations.id, invitationId));
}
