import { VaultCard } from "@/components/vault/vault-card";
import { CreateVaultDialog } from "@/components/vault/create-vault-dialog";
import { getUserContributedVaults } from "@/lib/api";

export async function ContributedVaults() {
  const contributedVaults = await getUserContributedVaults();

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Vaults You Contribute To</h2>
        <div className="w-[200px]">
          <CreateVaultDialog />
        </div>
      </div>
      {contributedVaults.length === 0 ? (
        <p className="text-muted-foreground">
          No contributed vaults yet. Create one to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributedVaults.map((vault) => (
            <VaultCard key={vault.id} vault={vault} isOwned={false} />
          ))}
        </div>
      )}
    </section>
  );
}
