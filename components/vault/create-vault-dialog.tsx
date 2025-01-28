"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  ownerName: z.string().min(1, "Owner name is required").max(100),
});

type CreateVaultForm = z.infer<typeof createVaultSchema>;

export function CreateVaultDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors, isSubmitting },
  // } = useForm<CreateVaultForm>({
  //   resolver: zodResolver(createVaultSchema),
  // });

  const form = useForm<CreateVaultForm>({
    resolver: zodResolver(createVaultSchema),
    defaultValues: {
      name: "",
      ownerEmail: "",
      ownerName: "",
    },
  });

  const onSubmit = async (data: CreateVaultForm) => {
    try {
      const result = await createVaultAction(
        data.name,
        data.ownerEmail,
        data.ownerName
      );
      if (result.success) {
        toast({
          title: "Success",
          description: "Vault created successfully",
        });
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Error creating vault",
          description: result.error || "Failed to create vault",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating vault",
        description: "An unexpected error occurred while creating the vault",
      });
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

        {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="ownerName">Owner&apos;s Name</Label>
            <Input
              {...register("ownerName")}
              id="ownerName"
              placeholder="Enter owner's name"
            />
            {errors.ownerName && (
              <p className="text-sm text-red-500">{errors.ownerName.message}</p>
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

          <DialogFooter className="gap-2">
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
        </form> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vault Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter vault name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner's Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter owner's name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner's Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter owner's email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Vault"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
