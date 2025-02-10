"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Existing action; adjust import path if necessary
import { inviteContributor } from "@/app/actions/invitation";

const inviteContributorSchema = z.object({
  email: z.string().email("Valid email is required"),
  inviteName: z.string().min(1, "Name is required"),
});

type InviteContributorForm = z.infer<typeof inviteContributorSchema>;

interface InviteContributorDialogProps {
  disabled: boolean;
  vaultId: number;
}

export function InviteContributorDialog({
  disabled,
  vaultId,
}: InviteContributorDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<InviteContributorForm>({
    resolver: zodResolver(inviteContributorSchema),
    defaultValues: {
      email: "",
      inviteName: "",
    },
  });

  const onSubmit = async (data: InviteContributorForm) => {
    try {
      const result = await inviteContributor(
        vaultId,
        data.email,
        data.inviteName
      );
      if (result?.success) {
        toast({
          title: "Contributor Invited",
          description: "Invitation sent successfully.",
        });
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to invite contributor.",
        });
      }
    } catch (error) {
      // If inviteContributor throws, catch it here and display the error message
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="flex items-center">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Contributor</DialogTitle>
          <DialogDescription>
            Invite new contributors to your vault.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="inviteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contributor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contributor Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending..." : "Invite"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
