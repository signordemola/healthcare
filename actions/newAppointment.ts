"use server";

import { getAllPhysicians, verifySession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { GetAppointmentSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

export const newAppointment = async (
  values: z.infer<typeof GetAppointmentSchema>
) => {
  // Validate the input fields using Zod
  const validatedFields = GetAppointmentSchema.safeParse(values);

  console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      error: "Validation failed",
      issues: validatedFields.error.issues,
    };
  }

  const session = await verifySession();

  if (!session?.patientId) {
    return { error: "Unauthorized. Please log in." };
  }

  const { primaryPhysician, schedule, reason, note, cancellationReason } =
    validatedFields.data;

  // Fetch all physicians
  const physicians = await getAllPhysicians();

  // Find the selected physician
  const selectedPhysician = physicians?.find(
    (physician) => physician.name === primaryPhysician
  );

  if (!selectedPhysician) {
    return { error: "Selected physician not found." };
  }

  

  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        physicianId: selectedPhysician?.id,
        schedule: new Date(schedule).toISOString(),
        reason,
        note,
        cancellationReason,
        patientId: session?.patientId,
      },
    });

    console.log(newAppointment)

    if (newAppointment) {
      return {
        success: "Appointment submitted!",
        redirect: `/patient/success?appointmentId=${newAppointment.id}`,
      };
    } else {
      return {
        error: "Appointment rejected!",
      };
    }
  } catch (error) {
    console.error("Appointment registration error:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "Appointment already exists." };
      }
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred. Please try again later." };
  }
};
