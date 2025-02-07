"use server";

import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { CreatePatientSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

export const registerPatient = async (
  values: z.infer<typeof CreatePatientSchema>
) => {
  // Validate input fields using Zod
  const validatedFields = CreatePatientSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields! Please fill properly." };
  }

  const session = await verifySession();

  if (!session?.userId) {
    return { error: "Unauthorized. Please log in." };
  }

  const {
    birthDate,
    gender,
    street,
    city,
    state,
    postalCode,
    country,
    occupation,
    emergencyContactName,
    emergencyContactNumber,
    insuranceProvider,
    insurancePolicyNumber,
    treatmentConsent,
    disclosureConsent,
    privacyConsent,
  } = validatedFields.data;

  try {
    const newPatient = await prisma.patient.create({
      data: {
        birthDate: new Date(birthDate),
        gender,
        street,
        city,
        state,
        postalCode,
        country,
        occupation,
        emergencyContactName,
        emergencyContactNumber,
        insuranceProvider,
        insurancePolicyNumber,
        treatmentConsent,
        disclosureConsent,
        privacyConsent,
        userId: session.userId, // Link to the User record
      },
    });

    if (newPatient) {
      return {
        success: `Patient Created!`,
        redirect: `/patient`,
      };
    } else {
      return {
        error: "Patient already existed, please update current profile",
        redirect: "/patient/profile",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "Patient already exists." };
      }
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred. Please try again later." };
  }
};
