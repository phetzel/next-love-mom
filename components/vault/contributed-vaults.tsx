import { VaultCard } from "@/components/vault/vault-card";
import { getUserContributedVaults } from "@/lib/api";

export async function ContributedVaults() {
  const contributedVaults = await getUserContributedVaults();

  if (contributedVaults.length === 0) return null;

  return (
    <section className="relative">
      <h2 className="text-2xl font-semibold text-primary mb-6">
        Vaults You Contribute to
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contributedVaults.map((vault) => (
          <VaultCard key={vault.id} vault={vault} isOwned={false} />
        ))}
      </div>
    </section>
  );
}
