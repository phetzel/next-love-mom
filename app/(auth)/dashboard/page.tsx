import { currentUser } from "@clerk/nextjs/server";

import { Logo } from "@/components/logo";
import { ContributedVaults } from "@/components/vault/contributed-vaults";
import { OwnedVaults } from "@/components/vault/owned-vaults";
import { InvitationCelebration } from "@/components/invite/invitation-celebration";
import { CreateVaultDialog } from "@/components/vault/create-vault-dialog";
import { canUserCreateVault } from "@/lib/api";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return null; // Handle no user case
  }

  const isMaxUserVaults = await canUserCreateVault();

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <div className="flex items-center justify-center mb-4">
        <Logo />
      </div>

      <h1 className="text-4xl font-bold text-center mb-2 text-primary">
        Welcome, {user.username || "User"}!
      </h1>
      <p className="text-center mb-12 text-muted-foreground">
        Here are your Memory Vaults
      </p>

      <InvitationCelebration />

      <OwnedVaults />
      <ContributedVaults />
      <CreateVaultDialog isMaxUserVaults={isMaxUserVaults} />
    </main>
  );
}
