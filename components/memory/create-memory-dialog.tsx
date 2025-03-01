"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Plus, X } from "lucide-react";

import { createMemoryAction } from "@/app/actions/memory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/lib/uploadthing";

const createMemorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  imageUrl: z.string().min(1, "Image is required"),
  audioUrl: z.string().min(1, "Audio is required"),
});

type CreateMemoryForm = z.infer<typeof createMemorySchema>;

interface CreateMemoryDialogProps {
  onMemoryCreated: () => void;
}

export function CreateMemoryDialog({
  onMemoryCreated,
}: CreateMemoryDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const form = useForm<CreateMemoryForm>({
    resolver: zodResolver(createMemorySchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      audioUrl: "",
    },
  });

  const onSubmit = async (data: CreateMemoryForm) => {
    try {
      const memoryData = {
        ...data,
        vaultId: parseInt(params.id as string),
      };
      const result = await createMemoryAction(memoryData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Memory created successfully",
        });

        onMemoryCreated();

        // Close the dialog + refresh page
        setOpen(false);
        setUploadedImage(null);
        setUploadedAudio(null);
        form.reset();
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to create memory",
        });
      }
    } catch (error) {
      console.error("Failed to create vault:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full max-w-[300px] mx-auto flex items-center justify-center">
          <Plus className="mr-2 h-4 w-4" /> Add New Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Memory</DialogTitle>
          <DialogDescription>
            Upload a photo or audio file and add details to create a new memory.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter memory title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter memory description"
                        className="h-32 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="space-y-2 text-center">
                  <Label className="block mb-2">Image Upload</Label>

                  {!uploadedImage ? (
                    <UploadButton
                      className="w-full ut-button:bg-primary ut-button:ut-readying:bg-primary/80"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        const url = res?.[0]?.url || "";
                        form.setValue("imageUrl", url);
                        setUploadedImage(url); // 2. Keep local state for preview
                        form.clearErrors("imageUrl");
                      }}
                      onUploadError={(error) => {
                        form.setError("imageUrl", {
                          type: "manual",
                          message: error.message,
                        });
                      }}
                    />
                  ) : (
                    <div className="relative group">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded image"
                        width={200}
                        height={200}
                        className="rounded-md object-cover mx-auto max-h-[200px] w-auto"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setUploadedImage(null);
                          form.setValue("imageUrl", "");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {form.formState.errors.imageUrl && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.imageUrl.message}
                    </p>
                  )}
                </div>

                {/* Audio Upload */}
                <div className="space-y-2 text-center">
                  <Label className="block mb-2">Audio Upload</Label>
                  {!uploadedAudio ? (
                    <UploadButton
                      className="w-full ut-button:bg-primary ut-button:ut-readying:bg-primary/80"
                      endpoint="audioUploader"
                      onClientUploadComplete={(res) => {
                        const url = res?.[0]?.url || "";
                        form.setValue("audioUrl", url);
                        setUploadedAudio(url); // 2. Keep local state for preview
                        form.clearErrors("audioUrl");
                      }}
                      onUploadError={(error) => {
                        form.setError("audioUrl", {
                          type: "manual",
                          message: error.message,
                        });
                      }}
                    />
                  ) : (
                    <div className="relative group flex flex-col items-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setUploadedAudio(null);
                          form.setValue("audioUrl", "");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <audio controls className="w-full mt-14">
                        <source src={uploadedAudio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  {form.formState.errors.audioUrl && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.audioUrl.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setUploadedImage(null);
                  setUploadedAudio(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Memory"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
