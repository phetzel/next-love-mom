import { clerkClient, currentUser } from "@clerk/nextjs/server";

import { MAX_VAULTS_PER_CREATOR } from "@/lib/constants";
import {
  getVaultsByOwnerId,
  getContributedVaults,
  getPendingUserInvites,
  getVaultDeposits,
  getVaultContributors,
  getVaultInvitations,
  isUserCreator,
  isUserOwner,
  getVaultsByCreatorId,
  getVaultById,
  getMemoryCount,
} from "@/lib/db/queries";
import { Vault, VaultDetails, Memory, Invite, InviteDetails } from "@/types";

//
async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

// Vault lists
export async function getUserOwnedVaults(): Promise<VaultDetails[]> {
  const user = await requireAuth();

  const ownedVaults = await getVaultsByOwnerId(user.id);

  // Get memory counts and format data
  return Promise.all(
    ownedVaults.map(async (vault) => {
      const memoryCount = await getMemoryCount(vault.id);

      return {
        ...vault,
        memoryCount: memoryCount.length,
        owner: {
          name: user.username,
          email: user.primaryEmailAddress?.emailAddress || "",
          imageUrl: user.imageUrl,
        },
      };
    })
  );
}

export async function getUserContributedVaults(): Promise<VaultDetails[]> {
  const user = await requireAuth();

  const contributedVaults = await getContributedVaults(user.id);

  // Get memory counts and format data
  return Promise.all(
    contributedVaults.map(async (vault) => {
      const memoryCount = await getMemoryCount(vault.id);

      if (vault.isOwnerClaimed && vault.ownerId) {
        const client = await clerkClient();
        const owner = await client.users.getUser(vault.ownerId);

        return {
          ...vault,
          memoryCount: memoryCount.length,
          owner: {
            name: owner.username,
            email: owner.primaryEmailAddress?.emailAddress || "",
            imageUrl: owner.imageUrl,
          },
        };
      }

      return {
        ...vault,
        memoryCount: memoryCount.length,
      };
    })
  );
}

export async function canUserCreateVault(): Promise<boolean> {
  const user = await requireAuth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const vaults = await getVaultsByCreatorId(user.id);
  return vaults.length >= MAX_VAULTS_PER_CREATOR;
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

  return vault;
}

// Memory Lists
export async function getUserVaultDeposits(vaultId: number): Promise<Memory[]> {
  const user = await requireAuth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const deposits = await getVaultDeposits(vaultId, user.id);

  return deposits;
}

// Contibutors
export async function getVaultContributorInvites(
  vaultId: number
): Promise<{ invitations: Invite[] }> {
  const user = await requireAuth();

  // Check if user is owner or creator
  const [isOwner, isCreatorResult] = await Promise.all([
    isUserOwner(vaultId, user.id),
    isUserCreator(vaultId, user.id),
  ]);

  if (!isOwner && !isCreatorResult) {
    throw new Error("Not authorized to view contributors");
  }

  // Get contributor invitations
  // const [contributors, allInvitations] = await Promise.all([
  //   getVaultContributors(vaultId),
  //   getVaultInvitations(vaultId),
  // ]);
  const contributorInvitations = await getVaultInvitations(
    vaultId,
    "contributor"
  );

  return {
    invitations: contributorInvitations,
  };
}

// Invitations
export async function getUserPendingInvites(): Promise<InviteDetails[]> {
  const user = await requireAuth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!user.primaryEmailAddress) {
    throw new Error("No primary email address");
  }

  const invites = await getPendingUserInvites(
    user.primaryEmailAddress.emailAddress
  );

  const client = await clerkClient();

  // Get invitor details from Clerk for each invite
  const invitesWithDetails = await Promise.all(
    invites.map(async (invite) => {
      const invitor = await client.users.getUser(invite.invitorId);

      return {
        ...invite,
        invitor: {
          name: invitor.username,
          email: invitor.primaryEmailAddress?.emailAddress || "",
          imageUrl: invitor.imageUrl,
        },
      };
    })
  );

  return invitesWithDetails;
}
