"use server";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { CreateUserSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

export const createUser = async (values: z.infer<typeof CreateUserSchema>) => {
  // Validate the input fields using Zod
  const validatedFields = CreateUserSchema.safeParse(values);

  console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      error: "Validation failed",
      issues: validatedFields.error.issues,
    };
  }

  try {
    const { fullName, email, password, phone } = validatedFields.data;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: `User with email ${email} already exists!` };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user and assign the "CUSTOMER" role
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
      },
    });

    if (user) {
      return {
        success: `User Created!`,
        redirect: `patient/register`,
      };
    }
  } catch (error) {
    console.error("Registration error:", error);

    // Handle Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "A user with this email already exists." };
      }
    }

    // Handle other errors
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred. Please try again later." };
  }
};
