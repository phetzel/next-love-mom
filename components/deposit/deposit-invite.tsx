import { getVaultContributorInvites } from "@/lib/api";
import { InvitedList } from "@/components/invite/invited-list";

interface DepositInviteProps {
  vaultId: number;
}

export default async function DepositInvite({ vaultId }: DepositInviteProps) {
  const { invitations } = await getVaultContributorInvites(vaultId);

  return <InvitedList invitations={invitations} vaultId={vaultId} />;
}
