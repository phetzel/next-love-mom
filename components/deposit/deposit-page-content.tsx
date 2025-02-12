"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CreateMemoryDialog } from "@/components/memory/create-memory-dialog";
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
        <h2 className="text-xl font-semibold text-center text-primary">
          Memory Deposit
        </h2>

        <CreateMemoryDialog onMemoryCreated={() => setShowList(true)} />

        <Button
          onClick={() => setShowList(!isShowList)}
          variant="outline"
          className="w-full max-w-[300px] mx-auto"
          // className="w-full transition-all duration-200 hover:bg-primary/10 hover:text-primary"
        >
          {isShowList ? "Hide" : "Show"} My Deposits
        </Button>
      </div>

      {isShowList && <DepositList memories={memories} />}
    </div>
  );
}
