"use client";

import * as React from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  React.useEffect(() => {
    if (user?.id) {
      router.push("/");
    }
  }, [user]);

  // Get the token from the query params
  const token = useSearchParams().get("__clerk_ticket");

  // If there is no invitation token, restrict access to this page
  if (!token) {
    return <p>No invitation token found.</p>;
  }

  // Handle submission of the sign-up form
  const onSubmit = async (data: FormData) => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.create({
        strategy: "ticket",
        ticket: token,
        username: data.username, // Use username
        password: data.password,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        // In case further steps are required.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Enter username</label>
          <input id="username" {...register("username")} />
          {errors.username && (
            <span role="alert">{errors.username.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="password">Enter password</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && (
            <span role="alert">{errors.password.message}</span>
          )}
        </div>
        <div>
          <button type="submit">Next</button>
        </div>
      </form>
    </>
  );
}
