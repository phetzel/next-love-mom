import { ClerkProvider } from "@clerk/nextjs";

export default function AuthLayout(props: { children: React.ReactNode }) {
  const signInUrl = "/sign-in";
  // const signUpUrl = "/sign-up";
  const signUpUrl = "/accept-invitation";
  const dashboardUrl = "/dashboard";
  const afterSignOutUrl = "/";

  return (
    <ClerkProvider
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={dashboardUrl}
      signUpFallbackRedirectUrl={dashboardUrl}
      afterSignOutUrl={afterSignOutUrl}
    >
      {props.children}
    </ClerkProvider>
  );
}
