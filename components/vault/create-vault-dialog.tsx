"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createVaultAction } from "@/app/actions/vault";

const createVaultSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  ownerEmail: z.string().email("Invalid email address"),
});

type CreateVaultForm = z.infer<typeof createVaultSchema>;

export function CreateVaultDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateVaultForm>({
    resolver: zodResolver(createVaultSchema),
  });

  const onSubmit = async (data: CreateVaultForm) => {
    try {
      const result = await createVaultAction(data.name, data.ownerEmail);
      if (result.success) {
        setOpen(false);
        reset();
        router.refresh();
      } else {
        console.error("Failed to create vault:", result.error);
      }
    } catch (error) {
      console.error("Failed to create vault:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center">
          <Button className="mt-12 mx-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create New Vault for Someone
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Memory Vault</DialogTitle>
          <DialogDescription>
            Create a memory vault for someone special.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Vault Name</Label>
            <Input
              {...register("name")}
              id="name"
              placeholder="Enter vault name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Owner&apos;s Email</Label>
            <Input
              {...register("ownerEmail")}
              id="ownerEmail"
              type="email"
              placeholder="Enter owner's email"
            />
            {errors.ownerEmail && (
              <p className="text-sm text-red-500">
                {errors.ownerEmail.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Vault"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
