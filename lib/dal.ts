"use server";

// import "server-only";

import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "./db";
import { redirect } from "next/navigation";
import { decodeToken } from "./auth";

export const verifySession = cache(async () => {
  // Retrieve the token from the cookie
  const token = (await cookies()).get("token")?.value;

  // If no token, return null
  if (!token) {
    console.log("No token found in cookies.");
    redirect("/login");
  }

  // Decode the token using the decodeToken function
  const decoded = await decodeToken(token);

  // If decoding fails or the payload is invalid, return null
  if (!decoded || !decoded.success || !decoded.payload) {
    console.log("Invalid or expired token.");
    return null;
  }

  // Extract the payload
  const { payload } = decoded;

  // Validate the payload to ensure it contains the required fields
  if (!payload.userId || !payload.role) {
    console.log("Invalid or incomplete session payload.");
    return null;
  }

  // Return only the verified session details
  return {
    role: String(payload.role),
    userId: String(payload.userId),
    fullName: String(payload.fullName),
    patientId: String(payload.patientId),
  };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId as string,
      },
    });

    return user;
  } catch (error) {
    console.log("Failed to fetch user", error);
    return null;
  }
});

export const getAllUsers = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const users = await prisma.user.findMany();

    return users;
  } catch (error) {
    console.log("Failed to fetch all users", error);
    return null;
  }
});

export const getPatient = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const patient = await prisma.patient.findUnique({
      where: {
        id: session.patientId as string,
      },
    });

    return patient;
  } catch (error) {
    console.log("Failed to fetch patient", error);
    return null;
  }
});

export const getAppointment = cache(async (appointmentId: string) => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId as string,
      },
    });

    return appointment;
  } catch (error) {
    console.log("Failed to fetch an appointment!", error);
    return null;
  }
});

export const deleteAppointment = cache(async (appointmentId: string) => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const appointment = await prisma.appointment.delete({
      where: {
        id: appointmentId as string,
      },
    });

    return { success: true, message: `${appointment} deleted` };
  } catch (error) {
    console.log("Failed to fetch an appointment!", error);
    return null;
  }
});

export const getAllAppointments = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const appointments = await prisma.appointment.findMany();

    return appointments;
  } catch (error) {
    console.log("Failed to fetch all appointments", error);
    return null;
  }
});

export const getAllAppointmentsDetails = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const appointmentDetails = await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        physician: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return appointmentDetails;
  } catch (error) {
    console.log("Failed to fetch full appointments details", error);
    return null;
  }
});

export const getAllPhysicians = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const physicians = await prisma.physician.findMany();

    return physicians;
  } catch (error) {
    console.log("Failed to fetch all physicians", error);
    return null;
  }
});

export const isRegisteredPatient = async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId as string,
      },
      include: { patient: true },
    });

    return user !== null && user.role === "PATIENT" && user.patient !== null;
  } catch (error) {
    console.log("Failed to fetch all users", error);
    return null;
  }
};
