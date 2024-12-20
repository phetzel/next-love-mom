import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MemoryCardProps {
  id: string;
  name: string;
  ownerName: string;
  memoryCount: number;
  lastUpdated: string;
  isOwned: boolean;
}

export function MemoryCard({
  id,
  name,
  ownerName,
  memoryCount,
  lastUpdated,
  isOwned,
}: MemoryCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isOwned && (
          <p className="mb-2 text-muted-foreground">Owner: {ownerName}</p>
        )}
        <p className="mb-4 text-muted-foreground">Memories: {memoryCount}</p>
        <Button
          asChild
          className="w-full"
          variant={isOwned ? "default" : "secondary"}
        >
          <Link
            href={
              isOwned ? `/dashboard/vault/${id}` : `/dashboard/deposit/${id}`
            }
          >
            {isOwned ? "Open Vault" : "Add Memory"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
