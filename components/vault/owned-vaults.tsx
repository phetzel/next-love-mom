import { VaultCard } from "@/components/vault/vault-card";
import { getUserOwnedVaults } from "@/lib/api";

export async function OwnedVaults() {
  const ownedVaults = await getUserOwnedVaults();

  if (ownedVaults.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-semibold mb-6 text-primary">Your Vaults</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ownedVaults.map((vault) => (
          <VaultCard key={vault.id} vault={vault} isOwned={true} />
        ))}
      </div>
    </section>
  );
}
