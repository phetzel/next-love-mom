"use server";

import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { render } from "@react-email/render";

import { env } from "@/lib/env";
import { db } from "@/lib/db/drizzle";
import { invitations } from "@/lib/db/schema";
import { isUserCreator, isUserOwner } from "@/lib/db/queries";
import { InviteContributorEmail } from "@/lib/email/emails/invite-contributor";

const resend = new Resend(env.RESEND_API_KEY);

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

  const [invite] = await db.insert(invitations).values({
    email,
    vaultId,
    invitorId: userId,
    type: "contributor",
    status: "pending",
  });

  console.log("Invite", invite);

  const mail = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "hello world",
    html: "<p>it works!</p>",
  });

  // const html = await render(<InviteContibutorEmail />, {
  //   pretty: true,
  // });

  console.log("got mail", mail);
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
