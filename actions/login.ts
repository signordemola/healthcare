"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/db";
import { SignJWT } from "jose"; // Import SignJWT from jose
import { cookies } from "next/headers";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Validate input fields using Zod
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email },
      include: { patient: true },
    });

    if (!user) {
      return { error: "User not found!" };
    }

    // Verify the password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: "Incorrect password!" };
    }

    // Create a JWT token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Encode the secret
    const token = await new SignJWT({
      userId: user.id,
      role: user.role,
      fullName: user.fullName,
      patientId: user.patient?.id,
    })
      .setProtectedHeader({ alg: "HS256" }) // Use HMAC SHA-256 algorithm
      .setIssuedAt() // Set the issued-at time
      .setExpirationTime("1h") // Set token expiration time (e.g., 1 hour)
      .sign(secret); // Sign the token with the secret

    // Set the token as an HTTP-only cookie
    (await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 3600, // 1 hour in seconds
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" in production, "lax" in development
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    console.log("Token created and cookie set:", token);

    // Redirect based on the user's role
    if (user.role === "ADMIN") {
      return {
        success: `Welcome back ${user.fullName}`,
        redirect: "/admin",
      };
    }

    if (user.role === "PATIENT" && user.patient !== null) {
      return {
        success: `Welcome back ${user.fullName}`,
        redirect: "/patient",
      };
    }

    if (user.role === "PATIENT" && user.patient === null) {
      return {
        success: `Welcome back ${user.fullName}`,
        redirect: "/patient/register",
      };
    }

    // Default redirect
    return { error: "Something went wrong, try again later!" };
  } catch (error) {
    console.error("Login error:", error);

    return { error: "Something went wrong,  try again later!" };
  }
};
