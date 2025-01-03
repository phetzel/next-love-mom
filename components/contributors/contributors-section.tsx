import { ScrollArea } from "@/components/ui/scroll-area";
import { getVaultContributorsAndInvites } from "@/lib/api";

interface ContributorsSectionProps {
  vaultId: number;
}

export default async function ContributorsSection({
  vaultId,
}: ContributorsSectionProps) {
  const { contributors, invitations } = await getVaultContributorsAndInvites(
    vaultId
  );

  return (
    <ScrollArea className="h-[calc(100vh-20rem)] rounded-md border p-4">
      <h2 className="font-bold text-lg mb-4">Contributors</h2>
      <ul className="mb-4">
        {contributors.map((contributor) => (
          <li key={contributor.id}>User ID: {contributor.id}</li>
        ))}
      </ul>

      <h2 className="font-bold text-lg mb-4">Pending Invitations</h2>
      <ul>
        {invitations.map((invite) => (
          <li key={invite.id}>
            {invite.email} - {invite.status}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
