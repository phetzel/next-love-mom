import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/uploadthing(.*)",
  "/api/vaults/(.*)",
]);

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  if (
    request.nextUrl.pathname.includes("/sign-in") ||
    request.nextUrl.pathname.includes("/sign-up") ||
    request.nextUrl.pathname.includes("/accept-invitation") ||
    isProtectedRoute(request)
  ) {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }

      return NextResponse.next();
    })(request, event);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/api/uploadthing(.*)",
    "/api/(.*)",
  ],
};
