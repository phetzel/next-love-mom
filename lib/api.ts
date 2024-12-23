import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { memories } from "@/lib/db/schema";
import { getVaultsByOwnerId, getContributedVaults } from "@/lib/db/queries";
import { Vault } from "@/types";

async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

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
        ownerName: "Owner", // TODO: Get owner name from Clerk
        memoryCount: memoryCount.length,
        lastUpdated: vault.updatedAt.toISOString().split("T")[0],
      };
    })
  );
}
