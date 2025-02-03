import { currentUser } from "@clerk/nextjs/server";

import DepositPageContent from "@/components/deposit/deposit-page-content";
import DepositInvite from "@/components/deposit/deposit-invite";
import { InviteOwnerCard } from "@/components/invite/invite-owner-card";
import { getUserVaultDeposits, getVault } from "@/lib/api";

export default async function DepositPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Fetch current user
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { id } = await params;
  const vaultId = parseInt(id);
  const vault = await getVault(vaultId);
  const memories = await getUserVaultDeposits(vaultId);

  const isCreator = vault.creatorId === user.id;

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        {vault.name}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow lg:w-2/3">
          <DepositPageContent memories={memories} />
        </div>
        {isCreator && (
          <div className="max-w-[400px] w-full lg:w-1/3 mx-auto space-y-4">
            <InviteOwnerCard vault={vault} memoryCount={memories.length} />
            <DepositInvite vaultId={vaultId} />
          </div>
        )}
      </div>
    </main>
  );
}
