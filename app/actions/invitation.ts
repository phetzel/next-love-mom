"use server";

import { Resend } from "resend";
import { auth, currentUser } from "@clerk/nextjs/server";

import { env } from "@/lib/env";
import {
  addContributorToVault,
  setOwnerClaimed,
  setOwnerInvited,
  createInvitation,
  deleteInvitation,
  updateInvitationStatus,
} from "@/lib/db/mutations";
import {
  getVaultById,
  getInvitationById,
  canManageInvitation,
  hasInvitation,
} from "@/lib/db/queries";
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

  const canManage = await canManageInvitation(vaultId, userId);
  if (!canManage) {
    throw new Error("Not authorized to invite contributors");
  }

  // Check if email matches vault owner
  if (email === vault.ownerEmail) {
    throw new Error("Cannot invite vault owner as contributor");
  }

  // Check for existing invites/contributors
  const hasExistingInvite = await hasInvitation(email, vaultId, "contributor");
  if (hasExistingInvite) {
    throw new Error("User already has an invitation or is a contributor");
  }

  // Create a new invite
  const [invite] = await createInvitation(
    email,
    inviteName,
    vaultId,
    userId,
    "contributor"
  );

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

  const hasExistingInvite = await hasInvitation(
    vault.ownerEmail,
    vaultId,
    "owner"
  );
  if (hasExistingInvite) {
    throw new Error("Owner already has an invitation or has claimed the vault");
  }

  // Create a new invite
  const [invite] = await createInvitation(
    vault.ownerEmail,
    vault.ownerName || "",
    vaultId,
    userId,
    "owner"
  );

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

  const invitation = await getInvitationById(invitationId);
  if (!invitation) throw new Error("Invitation not found");

  const canManage = await canManageInvitation(invitation.vaultId, userId);
  if (!canManage) {
    throw new Error("Not authorized to cancel this invitation");
  }

  await deleteInvitation(invitationId);
  return { success: true };
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

  const invitation = await getInvitationById(invitationId);
  if (!invitation) throw new Error("Invitation not found");
  if (invitation.status !== "pending")
    throw new Error("Invitation already accepted or rejected");

  if (invitation.email !== user.primaryEmailAddress?.emailAddress) {
    throw new Error("Not authorized to accept this invitation");
  }

  await updateInvitationStatus(invitationId, "accepted");

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

  const invitation = await getInvitationById(invitationId);
  if (!invitation) throw new Error("Invitation not found");
  if (invitation.status !== "pending")
    throw new Error("Invitation already accepted or rejected");

  if (invitation.email !== user.primaryEmailAddress?.emailAddress) {
    throw new Error("Not authorized to reject this invitation");
  }

  await updateInvitationStatus(invitationId, "rejected");
  return { success: true };
}
