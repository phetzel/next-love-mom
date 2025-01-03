import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface ContributorListProps {
  contributors: { id: string }[];
}

export function ContributorList({ contributors }: ContributorListProps) {
  if (!contributors.length) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground text-center">
          No contributors yet
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <ScrollArea className="h-[200px] p-4">
        <div className="space-y-2">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className="flex items-center justify-between p-2 rounded-lg bg-secondary"
            >
              <span className="text-sm">{contributor.id}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
