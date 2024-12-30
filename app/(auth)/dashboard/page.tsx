import { OwnedVaults } from "@/components/owned-vaults";
import { ContributedVaults } from "@/components/contributed-vaults";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return null; // Handle no user case
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4 text-primary">
        Welcome, {user.firstName || "User"}!
      </h1>
      <p className="text-center mb-12 text-muted-foreground">
        Here are your Memory Vaults
      </p>

      <OwnedVaults />
      <ContributedVaults />
    </main>
  );
}
