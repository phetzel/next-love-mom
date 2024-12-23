"use server";

import { auth } from "@clerk/nextjs/server";
import { createVault, addContributorToVault } from "@/lib/db/mutations";

export async function createVaultAction(name: string, ownerEmail: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  try {
    // Create the vault
    const [vault] = await createVault(name, userId, ownerEmail);

    // Add the creator as the first contributor
    await addContributorToVault(vault.id, userId);

    return { success: true, data: vault };
  } catch (error) {
    console.error("Failed to create vault:", error);
    return { success: false, error: "Failed to create vault" };
  }
}
