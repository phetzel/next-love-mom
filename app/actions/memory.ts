"use server";

import { auth } from "@clerk/nextjs/server";
import { createMemory, deleteMemory } from "@/lib/db/mutations";
import { isUserContributor, canDeleteMemory } from "@/lib/db/queries";

type CreateMemoryInput = {
  title: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  vaultId: number;
};

export async function createMemoryAction({
  title,
  description,
  imageUrl,
  audioUrl,
  vaultId,
}: CreateMemoryInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  try {
    const hasPermission = await isUserContributor(vaultId, userId);
    if (!hasPermission) {
      throw new Error("Not authorized to create memory");
    }

    const [memory] = await createMemory(
      title,
      description,
      imageUrl,
      audioUrl,
      vaultId,
      userId // depositorId
    );

    return { success: true, data: memory };
  } catch (error) {
    console.error("Failed to create memory:", error);
    return { success: false, error: "Failed to create memory" };
  }
}

export async function deleteMemoryAction(memoryId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  try {
    const permission = await canDeleteMemory(memoryId, userId);

    if (!permission.allowed) {
      return { success: false, error: permission.error };
    }

    const [deletedMemory] = await deleteMemory(memoryId);
    return { success: true, data: deletedMemory };
  } catch (error) {
    console.error("Failed to delete memory:", error);
    return { success: false, error: "Failed to delete memory" };
  }
}
