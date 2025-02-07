/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "male" | "female" | "other";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}

declare interface User {
  user: {
    id: string;
    role: string;
    email: string;
    fullName: string;
    phone: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

declare interface PatientRegisterParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

declare interface Appointment {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone?: string;
  appointment: Appointment;
  type: string;
};

export interface Appointment {
  id: string;
  patientId: string;
  createdAt: Date;
  updatedAt: Date;
  physicianId: string;
  schedule: Date; // Ensure this matches the property name in your data
  reason: string;
  note: string | null;
  cancellationReason: string | null;
  status: AppointmentStatus;
  approvedByAdminId: string | null;
  patient: {
    user: {
      fullName: string;
    };
  };
  physician: {
    name: string;
  };
  patientName: string; // Add this
  primaryPhysicianName: string; // Add this
}
