// import { OwnedVaults } from '@/components/OwnedVaults'
// import { ContributedVaults } from '@/components/ContributedVaults'
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();
  console.log("user", user);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">
          Welcome, {user?.firstName || "User"}!
        </h1>
        <p className="text-center mb-12 text-muted-foreground">
          Here are your Memory Vaults
        </p>

        {/* <OwnedVaults />
        <ContributedVaults /> */}
      </main>
    </div>
  );
}
