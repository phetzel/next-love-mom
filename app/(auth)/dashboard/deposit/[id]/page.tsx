"use client";

import { useState } from "react";
// import { AddMemoryDialog } from "@/components/AddMemoryDialog";
// import { EditMemoryDialog } from "@/components/EditMemoryDialog";
// import { UserMemoryList } from "@/components/UserMemoryList";
// import { MemoryViewDialog } from "@/components/MemoryViewDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Memory } from "@/types";

// Mock data for user's added memories
const initialMemories: Memory[] = [
  {
    id: "1",
    title: "My First Contribution",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/sample-audio.mp3",
  },
  {
    id: "2",
    title: "Family Reunion",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/sample-audio.mp3",
  },
];

export default function DepositPage({ params }: { params: { id: string } }) {
  const [showList, setShowList] = useState(false);
  const [userMemories, setUserMemories] = useState(initialMemories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const addMemory = (newMemory: Memory) => {
    setUserMemories([...userMemories, newMemory]);
    setIsAddDialogOpen(false);
  };

  const editMemory = (updatedMemory: Memory) => {
    setUserMemories(
      userMemories.map((memory) =>
        memory.id === updatedMemory.id ? updatedMemory : memory
      )
    );
    setIsEditDialogOpen(false);
  };

  const deleteMemory = (id: string) => {
    setUserMemories(userMemories.filter((memory) => memory.id !== id));
  };

  const openEditDialog = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Deposit Memories
        </h1>

        <div className="flex flex-col items-center space-y-4 mb-8">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full max-w-xs flex items-center justify-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Memory
          </Button>
          <Button
            onClick={() => setShowList(!showList)}
            variant="outline"
            className="w-full max-w-xs"
          >
            {showList ? "Hide" : "Show"} My Contributions
          </Button>
        </div>

        {showList && (
          <div className="mt-8 transition-all duration-300 ease-in-out max-h-[600px] overflow-hidden">
            {/* <UserMemoryList
              memories={userMemories}
              onDelete={deleteMemory}
              onEdit={openEditDialog}
              onView={openViewDialog}
            /> */}
          </div>
        )}

        {/* <AddMemoryDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddMemory={addMemory}
        /> */}

        {/* {selectedMemory && (
          <EditMemoryDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onEditMemory={editMemory}
            memory={selectedMemory}
          />
        )} */}

        {/* {selectedMemory && (
          <MemoryViewDialog
            isOpen={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            memory={selectedMemory}
          />
        )} */}
      </main>
    </div>
  );
}
