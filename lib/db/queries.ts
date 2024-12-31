import { db } from "./drizzle";
import { vaults, memories, vaultContributors } from "./schema";
import { eq, and } from "drizzle-orm";

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
  return result[0].count > 0;
};

export const isUserOwner = async (vaultId: number, userId: string) => {
  // Used to check if a user is the owner of a specific vault
  const result = await db
    .select({ count: vaults.id })
    .from(vaults)
    .where(and(eq(vaults.id, vaultId), eq(vaults.ownerId, userId)))
    .limit(1);
  return result[0].count > 0;
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

// Dashboard
export const getVaultsByOwnerId = async (ownerId: string) => {
  // Used in the dashboard to display vaults owned by the current user
  return db.select().from(vaults).where(eq(vaults.ownerId, ownerId));
};

export const getContributedVaults = async (userId: string) => {
  // Used in the dashboard to display vaults the user contributes to
  return db
    .select({
      id: vaults.id,
      name: vaults.name,
      ownerId: vaults.ownerId,
      createdAt: vaults.createdAt,
      updatedAt: vaults.updatedAt,
    })
    .from(vaultContributors)
    .innerJoin(vaults, eq(vaultContributors.vaultId, vaults.id))
    .where(eq(vaultContributors.userId, userId));
};

// Vault
export const getVaultById = async (id: number) => {
  // Used when viewing a specific vault's details, including all its memories
  const result = await db
    .select({
      vault: vaults,
      memories: memories,
    })
    .from(vaults)
    .leftJoin(memories, eq(vaults.id, memories.vaultId))
    .where(eq(vaults.id, id));

  if (result.length === 0) {
    return null;
  }

  const vault = result[0].vault;
  const vaultMemories = result.map((r) => r.memories).filter((m) => m !== null);

  return {
    ...vault,
    memories: vaultMemories,
  };
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
