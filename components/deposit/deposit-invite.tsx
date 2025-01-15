import { getVaultContributorsAndInvites } from "@/lib/api";
import { InvitedList } from "@/components/deposit/invited-list";

interface DepositInviteProps {
  vaultId: number;
}

export default async function DepositInvite({ vaultId }: DepositInviteProps) {
  const { contributors, invitations } =
    await getVaultContributorsAndInvites(vaultId);

  return <InvitedList invitations={invitations} vaultId={vaultId} />;
}
