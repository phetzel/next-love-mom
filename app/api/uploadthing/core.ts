import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    "image/jpeg": { maxFileSize: "16MB" },
    "image/png": { maxFileSize: "16MB" },
    "image/webp": { maxFileSize: "16MB" },
  })
    .middleware(async ({ req }) => {
      const { userId } = await getAuth(req);

      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("ourFileRouter Upload complete for userId:", metadata.userId);
      console.log("ourFileRouter File URL:", file.url);
    }),

  audioUploader: f({ audio: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      const { userId } = await getAuth(req);

      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
    }),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
