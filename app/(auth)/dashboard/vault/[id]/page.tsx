import { currentUser } from "@clerk/nextjs/server";

import { getVault, getVaultMemories } from "@/lib/api";
import VaultPageContent from "@/components/vault/vault-page-content";

export default async function VaultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { id } = await params;
  const vaultId = parseInt(id);
  const vault = await getVault(vaultId);
  if (!vault) {
    throw new Error("Vault not found");
  }

  // Ensure the current user owns the vault
  if (vault.ownerId !== user.id) {
    throw new Error("Not authorized: You do not own this vault");
  }

  const memories = await getVaultMemories(vaultId);

  return <VaultPageContent vault={vault} memories={memories} />;
}
