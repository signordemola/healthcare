"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  // Clear the token cookie
  (await cookies()).set({
    name: "token",
    value: "", // Empty value
    expires: new Date(0), // Expire immediately
    path: "/", // Match the path used when setting the cookie
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  // Redirect to the login page
  redirect("/login");
}
