"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { createVaultAction } from "@/app/actions/vault";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const createVaultSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  ownerEmail: z.string().email("Invalid email address"),
  ownerName: z.string().min(1, "Owner name is required").max(100),
});

type CreateVaultForm = z.infer<typeof createVaultSchema>;

interface CreateVaultDialogProps {
  isMaxUserVaults: boolean;
}

export function CreateVaultDialog({ isMaxUserVaults }: CreateVaultDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isMaxUserVaults) {
      setIsOpen(false);
    }
  }, [isMaxUserVaults]);

  const form = useForm<CreateVaultForm>({
    resolver: zodResolver(createVaultSchema),
    defaultValues: {
      name: "",
      ownerEmail: "",
      ownerName: "",
    },
  });

  const onSubmit = async (data: CreateVaultForm) => {
    if (isMaxUserVaults) {
      toast({
        variant: "destructive",
        title: "Error creating vault",
        description: "You have reached the maximum number of vaults allowed.",
      });
      return;
    }

    try {
      const result = await createVaultAction(
        data.name,
        data.ownerEmail,
        data.ownerName
      );
      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Vault created successfully",
        });
        setIsOpen(false);
        form.reset();

        const path = `/dashboard/deposit/${result.data.id}`;
        router.push(path);
      } else {
        toast({
          variant: "destructive",
          title: "Error creating vault",
          description: result.error || "Failed to create vault",
        });
      }
    } catch (error) {
      console.error("Failed to create vault:", error);
      toast({
        variant: "destructive",
        title: "Error creating vault",
        description: "An unexpected error occurred while creating the vault",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {isMaxUserVaults ? (
        <div className="flex items-center mt-12">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block mx-auto">
                  <Button className="mx-auto" disabled={true}>
                    <Plus className="mr-2 h-4 w-4" />
                    Maximum Vaults Created
                  </Button>
                </span>
              </TooltipTrigger>

              <TooltipContent>
                <p>You have reached the maximum number of vaults allowed.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <DialogTrigger asChild>
          <div className="flex items-center">
            <Button className="mt-12 mx-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create New Vault for Someone
            </Button>
          </div>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Memory Vault</DialogTitle>
          <DialogDescription>
            Create a memory vault for someone special.
          </DialogDescription>
        </DialogHeader>

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
                  <FormLabel>Owner&apos;s Name</FormLabel>
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
                  <FormLabel>Owner&apos;s Email</FormLabel>
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
                onClick={() => setIsOpen(false)}
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
