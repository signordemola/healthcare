"use server";

import { getAllPhysicians, verifySession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { GetAppointmentSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

export const updateAppointment = async (
  values: z.infer<typeof GetAppointmentSchema> & { appointmentId?: string }
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

  const {
    primaryPhysician,
    schedule,
    reason,
    note,
    cancellationReason,
    appointmentId,
    status,
  } = validatedFields.data;

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
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        physicianId: selectedPhysician.id,
        schedule: new Date(schedule).toISOString(),
        reason,
        note,
        cancellationReason,
        status,
      },
    });

    if (updatedAppointment) {
      return {
        redirect: `/admin`,
      };
    } else {
      return { error: "Appointment update failed!" };
    }
  } catch (error) {
    console.error("Appointment update error:", error);

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
