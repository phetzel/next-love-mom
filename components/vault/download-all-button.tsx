"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadAllButtonProps {
  vaultId: number;
  isDisabled?: boolean;
}

export function DownloadAllButton({
  vaultId,
  isDisabled = false,
}: DownloadAllButtonProps) {
  // Function to handle download
  const handleDownload = async () => {
    if (!vaultId) return;

    try {
      // Use window.location to navigate to our API endpoint
      window.location.href = `/api/vaults/${vaultId}/download`;
    } catch (error) {
      console.error("Error downloading memories:", error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      disabled={isDisabled}
      className="flex items-center gap-1"
    >
      <Download className="h-4 w-4" />
      Download All
    </Button>
  );
}
