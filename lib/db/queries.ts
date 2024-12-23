import { db } from "./drizzle";
import { users, vaults, memories, vaultContributors } from "./schema";
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
      id: users.id,
    })
    .from(vaultContributors)
    .innerJoin(users, eq(vaultContributors.userId, users.id))
    .where(eq(vaultContributors.vaultId, vaultId));
};

// Deposit
export const getVaultDeposits = async (vaultId: number, userId: string) => {
  // Used to get all contributions (memories) of a single user for a single vault
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
    .innerJoin(vaults, eq(memories.vaultId, vaults.id))
    .where(and(eq(memories.vaultId, vaultId), eq(vaults.ownerId, userId)));
};
