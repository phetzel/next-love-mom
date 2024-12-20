import { MemoryCard } from "@/components/memory-card";
import { contributedVaults } from "@/lib/mock";
import { Vault } from "@/types";

export function ContributedVaults() {
  return (
    <section className="relative">
      <h2 className="text-3xl font-semibold mb-6">Vaults You Contribute To</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contributedVaults.map((vault) => (
          <MemoryCard
            key={vault.id}
            id={vault.id}
            name={vault.name}
            ownerName={vault.ownerName}
            memoryCount={vault.memoryCount}
            lastUpdated={vault.lastUpdated}
            isOwned={false}
          />
        ))}
      </div>
    </section>
  );
}
