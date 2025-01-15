import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Memory } from "@/types";

interface DepositCardProps {
  memory: Memory;
  onView: (memory: Memory) => void;
  onDelete: (id: number) => void;
}

export function DepositCard({ memory, onView, onDelete }: DepositCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{memory.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {new Date(memory.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="relative w-full h-40 mb-4">
          <Image
            src={memory.imageUrl || "/placeholder.svg"}
            alt={memory.title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>

        <div className="flex justify-between items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(memory)}
          >
            <Eye className="h-4 w-4 mr-2" /> View
          </Button>

          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(memory.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
