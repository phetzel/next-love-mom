import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  // Run Clerk middleware only when it's necessary
  // if (
  //   request.nextUrl.pathname.includes("/sign-in") ||
  //   request.nextUrl.pathname.includes("/sign-up") ||
  //   isProtectedRoute(request)
  // ) {
  //   return clerkMiddleware()((auth, req) => {
  //     if (isProtectedRoute(req)) {
  //       const signInUrl = new URL(`/sign-in`, req.url);

  //       auth().protect({
  //         // `unauthenticatedUrl` is needed to avoid error: "Unable to find `next-intl` locale because the middleware didn't run on this request"
  //         unauthenticatedUrl: signInUrl.toString(),
  //       });
  //     }

  //     return NextResponse.next();
  //   })(request, event);
  // }

  if (
    request.nextUrl.pathname.includes("/sign-in") ||
    request.nextUrl.pathname.includes("/sign-up") ||
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
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
