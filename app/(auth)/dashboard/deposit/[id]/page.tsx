import { currentUser } from "@clerk/nextjs/server";

import { CreateMemoryDialog } from "@/components/dialog/create-memory-dialog";
import { DepositList } from "@/components/deposit/deposit-list";
import DepositPageContent from "@/components/deposit-page-content";
import ContributorsSection from "@/components/contributors/contributors-section";
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

  // const isCreator = await isUserCreator(vaultId, user.id);

  const isCreator = vault.creatorId === user.id;
  console.log("isCreator", isCreator);
  console.log("vault", vault);
  console.log("memories", memories);

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4 text-primary">
        Deposit Memories
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-grow">
          <DepositPageContent memories={memories} />
        </div>
        {isCreator && (
          <div className="w-full md:w-1/3">
            <ContributorsSection vaultId={vaultId} />
          </div>
        )}
      </div>
    </main>
  );
}
