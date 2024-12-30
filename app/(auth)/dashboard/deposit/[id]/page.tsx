import { CreateMemoryDialog } from "@/components/dialog/create-memory-dialog";
import { UserDepositList } from "@/components/user-deposit-list";
import { getUserVaultDeposits } from "@/lib/api";

interface Memory {
  id: number;
  title: string;
  imageUrl: string;
  audioUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default async function DepositPage({
  params,
}: {
  params: { id: string };
}) {
  const memories = await getUserVaultDeposits(parseInt(params.id));

  return (
    <main className="min-h-screen flex justify-center container mx-auto px-4 py-12">
      <div className="max-w-xs flex flex-col items-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">
          Deposit Memories
        </h1>

        <CreateMemoryDialog />

        <UserDepositList memories={memories} />
      </div>
    </main>
  );
}
