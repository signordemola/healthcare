import { AppointmentStatus } from "@prisma/client";
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required!",
  }),
  password: z.string().min(6, {
    message: "Password is required!",
  }),
});

export const CreateUserSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message: "Password must contain at least one special character",
    }),
});

export const PersonalInfoSchema = z.object({
  birthDate: z.string({
    message: "Birth date is required!",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender is required!",
  }),
  street: z.string({
    message: "Street address is required!",
  }),
  city: z.string({
    message: "City is required!",
  }),
  state: z.string({
    message: "State is required!",
  }),
  postalCode: z.string({
    message: "Postal code is required!",
  }),
  country: z.string({
    message: "Country is required!",
  }),
});

export const MedicalInfoSchema = z.object({
  insuranceProvider: z
    .string({
      message: "Insurance provider is required!",
    })
    .min(2, {
      message: "Insurance name must be at least 2 characters!",
    })
    .max(50, {
      message: "Insurance name must be at most 50 characters!",
    }),
  insurancePolicyNumber: z
    .string({
      message: "Insurance policy number is required!",
    })
    .min(2, {
      message: "Policy number must be at least 2 characters!",
    })
    .max(50, {
      message: "Policy number must be at most 50 characters!",
    }),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
});

export const IdentificationInfoSchema = z.object({
  occupation: z
    .string({
      message: "Occupation is required!",
    })
    .min(2, {
      message: "Occupation must be at least 2 characters!",
    })
    .max(500, {
      message: "Occupation must be at most 500 characters!",
    }),
  emergencyContactName: z
    .string({
      message: "Emergency contact name is required!",
    })
    .min(2, {
      message: "Contact name must be at least 2 characters!",
    })
    .max(50, {
      message: "Contact name must be at most 50 characters!",
    }),
  emergencyContactNumber: z
    .string({
      message: "Emergency contact number is required!",
    })
    .refine((value) => /^\+\d{10,15}$/.test(value), {
      message:
        "Phone number must be in international format (e.g., +1234567890)!",
    }),
  primaryPhysician: z
    .string({
      message: "Primary physician is required!",
    })
    .min(2, {
      message: "Select at least one doctor!",
    }),

  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
});

export const ConsentInfoSchema = z.object({
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const CreatePatientSchema = PersonalInfoSchema.merge(MedicalInfoSchema)
  .merge(IdentificationInfoSchema)
  .merge(ConsentInfoSchema);

export type PatientDataSchema = z.infer<typeof CreatePatientSchema>;

export const GetAppointmentSchema = z.object({
  appointmentId: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z
    .string()
    .nonempty("Schedule is required")
    // Optionally, add a refinement to check the date format
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Invalid date format",
    }),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const stepOneSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const stepTwoSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
});

// Merge schemas for final validation if needed
export const combinedSchema = stepOneSchema.merge(stepTwoSchema);

export type FormData = z.infer<typeof combinedSchema>;
