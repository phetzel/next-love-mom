"use server";

import { auth } from "@clerk/nextjs/server";
import { createMemory } from "@/lib/db/mutations";

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
    const [memory] = await createMemory(
      title,
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
