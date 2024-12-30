"use client";

import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Memory {
  id: number;
  title: string;
  imageUrl: string;
  audioUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDepositListProps {
  memories: Memory[];
}

export function UserDepositList({ memories }: UserDepositListProps) {
  const [showList, setShowList] = useState<boolean>(false);

  const onDelete = (id: number) => {};
  const onEdit = (memory: Memory) => {};
  const onView = (memory: Memory) => {};

  return (
    <div className="space-y-4 w-full mx-auto">
      <Button
        onClick={() => setShowList(!showList)}
        variant="outline"
        className="w-full max-w-xs transition-all duration-200 hover:bg-primary/10 hover:text-primary"
      >
        {showList ? "Hide" : "Show"} My Contributions
      </Button>

      {showList && (
        <div className="mt-4 space-y-4 max-w-md mx-auto animate-accordion-down transition-all duration-600 ease-in-out max-h-[600px] overflow-hidden">
          <h2 className="text-2xl font-semibold mb-4">My Contributions</h2>
          {memories.map((memory) => (
            <Card key={memory.id} className="flex justify-between items-center">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">{memory.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2 py-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onView(memory)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(memory)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(memory.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
