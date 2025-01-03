"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CreateMemoryDialog } from "@/components/dialog/create-memory-dialog";
import { DepositList } from "@/components/deposit/deposit-list";
import { Memory } from "@/types";

export default function DepositPageContent({
  memories,
}: {
  memories: Memory[];
}) {
  const [isShowList, setShowList] = useState<boolean>(false);

  return (
    <div className="flex flex-col flex-grow items-center space-y-4 mb-8">
      <div className="w-xs flex flex-col justify-center space-y-4 mb-8">
        <CreateMemoryDialog />

        <Button
          onClick={() => setShowList(!isShowList)}
          variant="outline"
          className="w-full transition-all duration-200 hover:bg-primary/10 hover:text-primary"
        >
          {isShowList ? "Hide" : "Show"} My Contributions
        </Button>
      </div>

      {isShowList && <DepositList memories={memories} />}
    </div>
  );
}
