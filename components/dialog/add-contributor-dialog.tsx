"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteContributor } from "@/app/actions/invitation";

const inviteContributorSchema = z.object({
  email: z.string().email("Valid email is required"),
  inviteName: z.string().min(1, "Name is required"),
});

type InviteContributorForm = z.infer<typeof inviteContributorSchema>;

interface AddContributorDialogProps {
  vaultId: number;
}

export function AddContributorDialog({ vaultId }: AddContributorDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteContributorForm>({
    resolver: zodResolver(inviteContributorSchema),
    defaultValues: {
      email: "",
      inviteName: "",
    },
  });

  const onSubmit = async (data: InviteContributorForm) => {
    try {
      await inviteContributor(vaultId, data.email, data.inviteName);
      setOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to send invitation:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Contributor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Contributor</DialogTitle>
          <DialogDescription>
            Send an invitation to collaborate on this vault.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inviteName" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="inviteName"
                  {...register("inviteName")}
                  disabled={isSubmitting}
                />
                {errors.inviteName && (
                  <p className="text-sm text-red-500">
                    {errors.inviteName.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
