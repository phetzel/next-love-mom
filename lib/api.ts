import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { memories } from "@/lib/db/schema";
import {
  getVaultsByOwnerId,
  getContributedVaults,
  getVaultDeposits,
  getVaultContributors,
  getVaultInvitations,
  isUserCreator,
  isUserOwner,
  getVaultById,
} from "@/lib/db/queries";
import { Vault, Memory } from "@/types";

async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

// Vault lists
export async function getUserOwnedVaults(): Promise<Vault[]> {
  const user = await requireAuth();

  const ownedVaults = await getVaultsByOwnerId(user.id);

  // Get memory counts and format data
  return Promise.all(
    ownedVaults.map(async (vault) => {
      const memoryCount = await db
        .select({ count: memories.id })
        .from(memories)
        .where(eq(memories.vaultId, vault.id));

      return {
        id: vault.id.toString(),
        name: vault.name,
        ownerName: "You",
        creatorId: vault.creatorId,
        memoryCount: memoryCount.length,
        lastUpdated: vault.updatedAt.toISOString().split("T")[0],
      };
    })
  );
}

export async function getUserContributedVaults(): Promise<Vault[]> {
  const user = await requireAuth();

  const contributedVaults = await getContributedVaults(user.id);

  // Get memory counts and format data
  return Promise.all(
    contributedVaults.map(async (vault) => {
      const memoryCount = await db
        .select({ count: memories.id })
        .from(memories)
        .where(eq(memories.vaultId, vault.id));

      return {
        id: vault.id.toString(),
        name: vault.name,
        ownerName: vault.ownerId ?? "", // TODO: Get owner name from Clerk
        creatorId: vault.creatorId ?? "", // TODO: Get creator name from Clerk
        memoryCount: memoryCount.length,
        lastUpdated: vault.updatedAt.toISOString().split("T")[0],
      };
    })
  );
}

// Vault
export async function getVault(vaultId: number): Promise<Vault> {
  const user = await requireAuth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const vault = await getVaultById(vaultId);

  if (!vault) {
    throw new Error("Vault not found");
  }

  return {
    id: vault.id.toString(),
    name: vault.name,
    ownerName: vault.ownerId ?? "", // TODO: Get owner name from Clerk
    creatorId: vault.creatorId ?? "", // TODO: Get creator name from Clerk
    memoryCount: vault.memories.length,
    lastUpdated: vault.updatedAt.toISOString().split("T")[0],
  };
}

// Memory Lists
export async function getUserVaultDeposits(vaultId: number): Promise<Memory[]> {
  const user = await requireAuth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const deposits = await getVaultDeposits(vaultId, user.id);

  return deposits.map((memory: Memory) => ({
    id: memory.id,
    title: memory.title,
    imageUrl: memory.imageUrl,
    audioUrl: memory.audioUrl,
    createdAt: memory.createdAt,
    updatedAt: memory.updatedAt,
  }));
}

// Contibutors
export async function getVaultContributorsAndInvites(vaultId: number) {
  const user = await requireAuth();

  // Check if user is owner or creator
  const [isOwner, isCreatorResult] = await Promise.all([
    isUserOwner(vaultId, user.id),
    isUserCreator(vaultId, user.id),
  ]);

  if (!isOwner && !isCreatorResult) {
    throw new Error("Not authorized to view contributors");
  }

  // Get contributors and invitations
  const [contributors, allInvitations] = await Promise.all([
    getVaultContributors(vaultId),
    getVaultInvitations(vaultId),
  ]);

  return {
    contributors: contributors.map((c) => ({ id: c.id })),
    invitations: allInvitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      status: inv.status,
    })),
  };
}
