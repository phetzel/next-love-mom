import { Sparkles } from "lucide-react";

import { getUserPendingInvites } from "@/lib/api";
import { ViewInvitesDialog } from "@/components/invite/view-invites-dialog";

export async function InvitationCelebration() {
  const invitations = await getUserPendingInvites();

  if (!invitations.length) {
    return null;
  }

  return (
    <div className="mb-8 transition-shadow duration-300 ease-in-out hover:shadow-xl rounded-lg">
      <div className="bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg p-6 shadow-lg animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Sparkles className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                You have {invitations.length} new invitation
                {invitations.length > 1 ? "s" : ""}!
              </h2>
              <p className="text-white opacity-90">
                Join new Memory Vaults and start contributing
              </p>
            </div>
          </div>

          <ViewInvitesDialog invites={invitations} />
        </div>
      </div>
    </div>
  );
}
