import { Eye, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Memory } from "@/types";

interface DepositCardProps {
  memory: Memory;
  onView: (memory: Memory) => void;
  onEdit: (memory: Memory) => void;
  onDelete: (id: number) => void;
}

export function DepositCard({
  memory,
  onView,
  onEdit,
  onDelete,
}: DepositCardProps) {
  return (
    <Card className="flex justify-between items-center">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">{memory.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-2 py-3">
        <Button variant="outline" size="icon" onClick={() => onView(memory)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onEdit(memory)}>
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
  );
}
