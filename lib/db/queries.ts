import { db } from "./drizzle";
import { vaults, memories, vaultContributors, invitations } from "./schema";
import { eq, and, or } from "drizzle-orm";

// Permissions
export const isUserContributor = async (vaultId: number, userId: string) => {
  // Used to check if a user has permission to contribute to a vault
  const result = await db
    .select({ count: vaultContributors.id })
    .from(vaultContributors)
    .where(
      and(
        eq(vaultContributors.vaultId, vaultId),
        eq(vaultContributors.userId, userId)
      )
    )
    .limit(1);
  return result.length > 0 && result[0].count > 0;
};

export const isUserCreator = async (vaultId: number, userId: string) => {
  const result = await db
    .select({ count: vaults.id })
    .from(vaults)
    .where(and(eq(vaults.id, vaultId), eq(vaults.creatorId, userId)))
    .limit(1);
  return result.length > 0 && result[0].count > 0;
};

export const isUserOwner = async (vaultId: number, userId: string) => {
  // Used to check if a user is the owner of a specific vault
  const result = await db
    .select({ count: vaults.id })
    .from(vaults)
    .where(and(eq(vaults.id, vaultId), eq(vaults.ownerId, userId)))
    .limit(1);
  return result.length > 0 && result[0].count > 0;
};

export const canDeleteMemory = async (memoryId: number, userId: string) => {
  // Check if user is either the memory depositor or vault owner
  const memory = await db.query.memories.findFirst({
    where: eq(memories.id, memoryId),
  });

  if (!memory) {
    return { allowed: false, error: "Memory not found" };
  }

  // Check if user is the memory depositor
  if (memory.depositorId === userId) {
    return { allowed: true };
  }

  // Check if user is the vault owner
  const vault = await db.query.vaults.findFirst({
    where: eq(vaults.id, memory.vaultId),
  });

  if (!vault) {
    return { allowed: false, error: "Vault not found" };
  }

  return {
    allowed: vault.ownerId === userId,
    error:
      vault.ownerId !== userId
        ? "Not authorized to delete this memory"
        : undefined,
  };
};

export const canManageInvitation = async (vaultId: number, userId: string) => {
  const isCreator = await isUserCreator(vaultId, userId);
  const isOwner = await isUserOwner(vaultId, userId);
  return isCreator || isOwner;
};

// Dashboard
export const getVaultsByOwnerId = async (ownerId: string) => {
  // Used in the dashboard to display vaults owned by the current user
  return db.select().from(vaults).where(eq(vaults.ownerId, ownerId));
};

export const getContributedVaults = async (userId: string) => {
  // Used in the dashboard to display vaults the user contributes to
  const rows = await db
    .select({
      vault: vaults,
    })
    .from(vaultContributors)
    .innerJoin(vaults, eq(vaultContributors.vaultId, vaults.id))
    .where(eq(vaultContributors.userId, userId));

  // Return only vault objects
  return rows.map((row) => row.vault);
};

export const getVaultsByCreatorId = async (creatorId: string) => {
  // Used in the dashboard to display vaults created by the current user
  return db.select().from(vaults).where(eq(vaults.creatorId, creatorId));
};

// Vault
export const getVaultById = async (vaultId: number) => {
  const [vault] = await db
    .select()
    .from(vaults)
    .where(eq(vaults.id, vaultId))
    .limit(1);

  return vault || null;
};

export const getVaultContributors = async (vaultId: number) => {
  // Used to display all contributors for a specific vault
  return db
    .select({
      id: vaultContributors.userId,
    })
    .from(vaultContributors)
    .where(eq(vaultContributors.vaultId, vaultId));
};

// Deposit
export const getVaultDeposits = async (vaultId: number, userId: string) => {
  // Used to get all memories deposited by a specific user in a vault
  return db
    .select({
      id: memories.id,
      title: memories.title,
      imageUrl: memories.imageUrl,
      audioUrl: memories.audioUrl,
      createdAt: memories.createdAt,
      updatedAt: memories.updatedAt,
    })
    .from(memories)
    .where(
      and(eq(memories.vaultId, vaultId), eq(memories.depositorId, userId))
    );
};

// Memories
export const getMemoryCount = async (vaultId: number) => {
  // Used to get the total number of memories in a vault
  return db
    .select({ count: memories.id })
    .from(memories)
    .where(eq(memories.vaultId, vaultId));
};

// Invitations
export const getVaultInvitations = async (vaultId: number) => {
  return db.select().from(invitations).where(eq(invitations.vaultId, vaultId));
};

export const getInvitationById = async (invitationId: number) => {
  return await db.query.invitations.findFirst({
    where: eq(invitations.id, invitationId),
  });
};

export const hasInvitation = async (
  email: string,
  vaultId: number,
  type: "owner" | "contributor"
) => {
  const result = await db.query.invitations.findFirst({
    where: and(
      eq(invitations.email, email),
      eq(invitations.vaultId, vaultId),
      eq(invitations.type, type),
      or(eq(invitations.status, "pending"), eq(invitations.status, "accepted"))
    ),
  });
  return !!result;
};

export const getPendingUserInvites = async (email: string) => {
  return await db.query.invitations.findMany({
    where: and(eq(invitations.email, email), eq(invitations.status, "pending")),
    with: {
      vault: true,
    },
  });
};
