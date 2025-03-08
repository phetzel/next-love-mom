import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getVaultMemoriesByVaultId, isUserOwner } from "@/lib/db/queries";
import { getVaultById } from "@/lib/db/queries";
import archiver from "archiver";
import { Readable } from "stream";

export async function GET(
  request: NextRequest,
  { params }: { params: { vaultId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vaultId = parseInt(params.vaultId);
    if (isNaN(vaultId)) {
      return new NextResponse("Invalid vault ID", { status: 400 });
    }

    // Check if user is the vault owner
    const isOwner = await isUserOwner(vaultId, user.id);
    if (!isOwner) {
      return new NextResponse(
        "Unauthorized: You must be the vault owner to download memories",
        {
          status: 403,
        }
      );
    }

    // Get vault details for naming the zip file
    const vault = await getVaultById(vaultId);
    if (!vault) {
      return new NextResponse("Vault not found", { status: 404 });
    }

    // Get all memories for the vault
    const memories = await getVaultMemoriesByVaultId(vaultId);
    if (!memories || memories.length === 0) {
      return new NextResponse("No memories found in this vault", {
        status: 404,
      });
    }

    // Create a zip file using archiver
    const archive = archiver("zip", {
      zlib: { level: 5 }, // Compression level
    });

    // Set up response headers
    const safeVaultName = vault.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    const filename = `${safeVaultName}_memories_${timestamp}.zip`;

    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    // Create a stream that we'll pipe the archive into
    const chunks: Uint8Array[] = [];
    const body = new ReadableStream({
      start(controller) {
        archive.on("data", (chunk) => {
          controller.enqueue(chunk);
        });

        archive.on("end", () => {
          controller.close();
        });

        archive.on("error", (err) => {
          controller.error(err);
        });
      },
    });

    // Process each memory and add it to the archive
    try {
      // Add each memory to the archive
      const fetchPromises = memories.map(async (memory, index) => {
        try {
          // Add image
          if (memory.imageUrl) {
            const imgResponse = await fetch(memory.imageUrl);
            if (imgResponse.ok) {
              const imgBuffer = await imgResponse.arrayBuffer();
              archive.append(Buffer.from(imgBuffer), {
                name: `memory_${memory.id}/image_${index}.jpg`,
              });
            }
          }

          // Add audio
          if (memory.audioUrl) {
            const audioResponse = await fetch(memory.audioUrl);
            if (audioResponse.ok) {
              const audioBuffer = await audioResponse.arrayBuffer();
              archive.append(Buffer.from(audioBuffer), {
                name: `memory_${memory.id}/audio_${index}.mp3`,
              });
            }
          }

          // Add a simple JSON file with memory metadata
          const metadataJson = JSON.stringify(
            {
              id: memory.id,
              title: memory.title,
              createdAt: memory.createdAt,
              updatedAt: memory.updatedAt,
            },
            null,
            2
          );

          archive.append(metadataJson, {
            name: `memory_${memory.id}/metadata.json`,
          });
        } catch (error) {
          console.error(`Error processing memory ${memory.id}:`, error);
          // Continue with other memories if one fails
        }
      });

      // Wait for all fetches to complete
      await Promise.all(fetchPromises);

      // Finalize the archive
      archive.finalize();

      // Return the stream as the response
      return new NextResponse(body, {
        headers,
        status: 200,
      });
    } catch (error) {
      console.error("Error creating zip archive:", error);
      return new NextResponse("Error creating zip archive", { status: 500 });
    }
  } catch (error) {
    console.error("Error in download API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
