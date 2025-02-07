import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function decodeToken(token: string) {
  try {
    const secret = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(process.env.JWT_SECRET!),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const [header, payload, signature] = token.split(".");
    const data = new TextEncoder().encode(`${header}.${payload}`);
    const signatureBytes = Uint8Array.from(
      atob(signature.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    const isValid = await crypto.subtle.verify(
      { name: "HMAC", hash: "SHA-256" },
      secret,
      signatureBytes,
      data
    );

    if (!isValid) {
      console.error("Token is invalid");
      return null;
    }

    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const currentPath = request.nextUrl.pathname.replace(/\/$/, ""); // Normalize path

  // console.log("Current Path:", currentPath);
  // console.log("Token:", token);

  // Define public and protected routes
  const publicRoutes = ["/login"];
  const protectedRoutes = ["/admin", "/patient"]; // Updated to match group routes

  // Check if the current route is public (exact match)
  const isPublicRoute = publicRoutes.includes(currentPath);

  // Check if the current route is protected (startsWith)
  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  console.log("Is Public Route:", isPublicRoute);
  console.log("Is Protected Route:", isProtectedRoute);

  // Special handling for the homepage
  if (currentPath === "/" && token) {
    const decodedToken = await decodeToken(token);
    if (decodedToken) {
      const redirectUrl =
        decodedToken.role === "ADMIN"
          ? "/admin"
          : decodedToken.role === "PATIENT" && decodedToken.patient !== null
          ? "/patient"
          : decodedToken.role === "PATIENT" && decodedToken.patient === null
          ? "/patient/register"
          : "/";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Redirect logic for protected routes
  if (isProtectedRoute && !token) {
    // console.log("Redirecting to /login (no token)");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logic for public routes
  if (isPublicRoute && token) {
    const decodedToken = await decodeToken(token);
    console.log("Decoded Token:", decodedToken);

    if (decodedToken) {
      // console.log("User Role:", decodedToken.role);
      const redirectUrl =
        decodedToken.role === "ADMIN"
          ? "/admin" // Updated to match group route
          : decodedToken.role === "PATIENT" && decodedToken.patient !== null
          ? "/patient" // Updated to match group route
          : decodedToken.role === "PATIENT" && decodedToken.patient === null
          ? "/patient/register"
          : "/"; // Fallback for invalid roles
      // console.log("Redirecting to:", redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Enforce role-based access control for protected routes
  if (isProtectedRoute && token) {
    const decodedToken = await decodeToken(token);
    // console.log("Decoded Token:", decodedToken);

    if (decodedToken) {
      // console.log("User Role:", decodedToken.role);

      // Check if the user is trying to access a route that doesn't match their role
      if (
        (currentPath.startsWith("/admin") && decodedToken.role !== "ADMIN") ||
        (currentPath.startsWith("/patient") && decodedToken.role !== "PATIENT")
      ) {
        // console.log("Unauthorized access detected");
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
