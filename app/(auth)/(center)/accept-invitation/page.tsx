"use client";

import { useEffect, useState } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

// Define a validation schema with Zod
const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type FormData = z.infer<typeof formSchema>;

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialize React Hook Form using the zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle signed-in users visiting this page
  // This will also redirect the user once they finish the sign-up process
  useEffect(() => {
    if (user?.id) {
      router.push("/");
    }
  }, [user]);

  // Get the token from the query params
  const token = useSearchParams().get("__clerk_ticket");

  // If there is no invitation token, restrict access to this page
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Access Denied
            </CardTitle>
            <CardDescription className="text-center">
              No invitation token found. Please check your invitation link and
              try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Handle submission of the sign-up form
  const onSubmit = async (data: FormData) => {
    if (!isLoaded) return;
    setIsLoading(true);
    setServerError(null);

    try {
      const signUpAttempt = await signUp.create({
        strategy: "ticket",
        ticket: token,
        username: data.username, // Use username
        password: data.password,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push("/dashboard");
      } else {
        // In case further steps are required.
        setServerError("An unexpected error occurred.");
      }
    } catch (error: unknown) {
      // Ensure the error is an object, non-null, and check for a possible "errors" property
      if (
        typeof error === "object" &&
        error !== null &&
        "errors" in error &&
        Array.isArray((error as { errors: { message: string }[] }).errors) &&
        (error as { errors: { message: string }[] }).errors.length > 0
      ) {
        // Only display the first Clerk error message.
        const firstError = (error as { errors: { message: string }[] })
          .errors[0];
        setServerError(firstError.message);
      } else {
        setServerError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  {...register("username")}
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Display any global server error */}
              {serverError && (
                <p className="mt-4 text-sm text-red-500">{serverError}</p>
              )}
            </div>
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
