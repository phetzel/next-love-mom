import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isUserOwner } from "@/lib/db/queries";
import { getMemoryById } from "@/lib/db/queries"; // You'll need to create this function
import archiver from "archiver";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vaultId: string; memoryId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { vaultId: vaultIdStr, memoryId: memoryIdStr } = await params;
    const vaultId = parseInt(vaultIdStr);
    const memoryId = parseInt(memoryIdStr);

    if (isNaN(vaultId) || isNaN(memoryId)) {
      return new NextResponse("Invalid ID parameters", { status: 400 });
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

    // Get the memory
    const memory = await getMemoryById(memoryId);
    if (!memory || memory.vaultId !== vaultId) {
      return new NextResponse(
        "Memory not found or doesn't belong to this vault",
        { status: 404 }
      );
    }

    // Create a zip file using archiver
    const archive = archiver("zip", {
      zlib: { level: 5 }, // Compression level
    });

    // Set up response headers
    const safeMemoryTitle = memory.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    const filename = `memory_${memory.id}_${safeMemoryTitle}_${timestamp}.zip`;

    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    // Create a stream that we'll pipe the archive into
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

    try {
      // Add the memory's files to the archive

      // Add image
      if (memory.imageUrl) {
        const imgResponse = await fetch(memory.imageUrl);
        if (imgResponse.ok) {
          const imgBuffer = await imgResponse.arrayBuffer();
          archive.append(Buffer.from(imgBuffer), {
            name: `image.jpg`,
          });
        }
      }

      // Add audio
      if (memory.audioUrl) {
        const audioResponse = await fetch(memory.audioUrl);
        if (audioResponse.ok) {
          const audioBuffer = await audioResponse.arrayBuffer();
          archive.append(Buffer.from(audioBuffer), {
            name: `audio.mp3`,
          });
        }
      }

      //   // Add a simple JSON file with memory metadata
      //   const metadataJson = JSON.stringify(
      //     {
      //       id: memory.id,
      //       title: memory.title,
      //       createdAt: memory.createdAt,
      //       updatedAt: memory.updatedAt,
      //     },
      //     null,
      //     2
      //   );

      //   archive.append(metadataJson, { name: `metadata.json` });

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
