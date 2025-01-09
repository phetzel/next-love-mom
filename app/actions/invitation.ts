"use server";

import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { render } from "@react-email/render";

import { env } from "@/lib/env";
import { db } from "@/lib/db/drizzle";
import { invitations } from "@/lib/db/schema";
import { isUserCreator, isUserOwner, getVaultById } from "@/lib/db/queries";
import { InviteContributorEmail } from "@/lib/email/emails/invite-contributor";

const resend = new Resend(env.RESEND_API_KEY);

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
  console.log("inviteContributor user", user);

  const vault = await getVaultById(vaultId);
  if (!vault) throw new Error("Vault not found");
  console.log("inviteContributor vault", vault);

  const isCreator = await isUserCreator(vaultId, userId);
  const isOwner = await isUserOwner(vaultId, userId);
  if (!isCreator && !isOwner) {
    throw new Error("Not authorized to invite contributors");
  }

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
  console.log("invite", invite);

  const inviteUrl = `${env.NEXT_PUBLIC_APP_URL}/invite/${invite.id}`;

  try {
    const mail = await resend.emails.send({
      from: "Memory Vault <invite@mail.iloveyouforever.live>",
      to: [email],
      subject: `You've been invited to contribute to ${vault.name}`,
      react: InviteContributorEmail({
        inviteName: email,
        inviteUrl,
        invitedByName: vault.creatorId,
        invitedByEmail: vault.creatorId,
        vaultName: vault.name,
      }),
    });
    console.log("got mail", mail);

    if (!mail.data) {
      throw new Error("Failed to send email: " + mail.error);
    }

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
