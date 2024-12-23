import { vaults, memories, vaultContributors } from "./schema";
import { eq, and } from "drizzle-orm";
import { db } from "./drizzle";

// Vault mutations
export const createVault = async (
  name: string,
  creatorId: string,
  ownerEmail: string
) => {
  // Used when creating a new memory vault for someone
  return db
    .insert(vaults)
    .values({
      name,
      creatorId,
      ownerEmail,
      isClaimed: false,
    })
    .returning();
};

// User deletion
export const deleteUserData = async (userId: string) => {
  // Delete all memories uploaded by the user
  await db.delete(memories).where(eq(memories.depositorId, userId));

  // Delete all vault contributions
  await db
    .delete(vaultContributors)
    .where(eq(vaultContributors.userId, userId));

  // Get all vaults owned by the user
  const userVaults = await db
    .select()
    .from(vaults)
    .where(eq(vaults.ownerId, userId));

  // Delete all memories in user's vaults
  for (const vault of userVaults) {
    await db.delete(memories).where(eq(memories.vaultId, vault.id));
  }

  // Delete all vault contributors for user's vaults
  for (const vault of userVaults) {
    await db
      .delete(vaultContributors)
      .where(eq(vaultContributors.vaultId, vault.id));
  }

  // Finally delete all vaults owned by the user
  await db.delete(vaults).where(eq(vaults.ownerId, userId));
};

export const updateVault = async (id: number, name: string) => {
  // Used to update vault details, such as changing its name
  return db
    .update(vaults)
    .set({ name, updatedAt: new Date() })
    .where(eq(vaults.id, id))
    .returning();
};

export const deleteVault = async (id: number) => {
  // Used when a user wants to delete their vault
  return db.delete(vaults).where(eq(vaults.id, id)).returning();
};

// Memory mutations
export const createMemory = async (
  title: string,
  imageUrl: string,
  audioUrl: string,
  vaultId: number,
  depositorId: string
) => {
  // Used when adding a new memory to a vault
  return db
    .insert(memories)
    .values({ title, imageUrl, audioUrl, vaultId, depositorId })
    .returning();
};

export const updateMemory = async (
  id: number,
  title: string,
  imageUrl: string,
  audioUrl: string
) => {
  // Used when editing an existing memory
  return db
    .update(memories)
    .set({ title, imageUrl, audioUrl, updatedAt: new Date() })
    .where(eq(memories.id, id))
    .returning();
};

export const deleteMemory = async (id: number) => {
  // Used when removing a memory from a vault
  return db.delete(memories).where(eq(memories.id, id)).returning();
};

// Vault contributor mutations
export const addContributorToVault = async (
  vaultId: number,
  userId: string
) => {
  // Used when inviting a user to contribute to a vault
  return db.insert(vaultContributors).values({ vaultId, userId }).returning();
};

export const removeContributorFromVault = async (
  vaultId: number,
  userId: string
) => {
  // Used when removing a contributor's access to a vault
  return db
    .delete(vaultContributors)
    .where(
      and(
        eq(vaultContributors.vaultId, vaultId),
        eq(vaultContributors.userId, userId)
      )
    )
    .returning();
};
