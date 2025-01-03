import { ScrollArea } from "@/components/ui/scroll-area";
import { getVaultContributorsAndInvites } from "@/lib/api";
import { AddContributorDialog } from "@/components/dialog/add-contributor-dialog";
import { InvitedList } from "@/components/contributors/invited-list";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contributors</h2>
        <AddContributorDialog vaultId={vaultId} />
      </div>

      <InvitedList invitations={invitations} />

      <ScrollArea className="h-[calc(100vh-20rem)] rounded-md border">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Active Contributors</h3>
            <ul className="space-y-3">
              {contributors.map((contributor) => (
                <li
                  key={contributor.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <span>{contributor.id}</span>
                </li>
              ))}
              {contributors.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No active contributors yet
                </p>
              )}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
