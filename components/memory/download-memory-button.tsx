"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadMemoryButtonProps {
  vaultId: number;
  memoryId: number;
  isDisabled?: boolean;
}

export function DownloadMemoryButton({
  vaultId,
  memoryId,
  isDisabled = false,
}: DownloadMemoryButtonProps) {
  const handleDownload = () => {
    if (!vaultId || !memoryId) return;

    try {
      window.location.href = `/api/vaults/${vaultId}/memories/${memoryId}/download`;
    } catch (error) {
      console.error("Error downloading memory:", error);
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
      Download
    </Button>
  );
}
