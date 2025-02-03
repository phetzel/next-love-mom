"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createVault, addContributorToVault } from "@/lib/db/mutations";
import { getVaultsByCreatorId } from "@/lib/db/queries";
import { MAX_VAULTS_PER_CREATOR } from "@/lib/constants";

export async function createVaultAction(
  name: string,
  ownerEmail: string,
  ownerName: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await currentUser();
  if (!user) throw new Error("User not found");

  // Prevent creating vault for self
  if (ownerEmail === user.primaryEmailAddress?.emailAddress) {
    return { success: false, error: "Cannot create a vault for yourself" };
  }

  // Limit number of vaults that a user can create
  const createdVaults = await getVaultsByCreatorId(userId);
  if (createdVaults.length >= MAX_VAULTS_PER_CREATOR) {
    return { success: false, error: "Maximum vault limit reached" };
  }

  try {
    // Create the vault
    const [vault] = await createVault(name, userId, ownerEmail, ownerName);

    // Add the creator as the first contributor
    await addContributorToVault(vault.id, userId);

    return { success: true, data: vault };
  } catch (error) {
    console.error("Failed to create vault:", error);
    return { success: false, error: "Failed to create vault" };
  }
}
