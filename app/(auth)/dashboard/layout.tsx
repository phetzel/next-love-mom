import { Header } from "@/components/header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
