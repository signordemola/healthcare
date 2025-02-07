"use client";

import { AppointmentStatus } from "@prisma/client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GetAppointmentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import { Doctors } from "@/constants";
import FormError from "./form-error";
import SubmitButton from "../SubmitButton";
import { updateAppointment } from "@/actions/updateAppointment";
import { useRouter } from "next/navigation";

interface Appointment {
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

const UpadateAppointmentForm = ({
  type = "update",
  appointment,
  setOpen,
}: {
  type: "update" | "approve" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // Helper function to format the date for the input field
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const form = useForm<z.infer<typeof GetAppointmentSchema>>({
    resolver: zodResolver(GetAppointmentSchema),
    defaultValues: {
      appointmentId: appointment?.id,
      status: appointment?.status ?? AppointmentStatus.SCHEDULED,
      primaryPhysician: appointment?.primaryPhysicianName || "",
      schedule: appointment?.schedule
        ? formatDateForInput(appointment.schedule)
        : formatDateForInput(new Date()),
      reason: appointment?.reason || "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof GetAppointmentSchema>) => {
    let newStatus: AppointmentStatus;
    switch (type) {
      case "approve":
        newStatus = AppointmentStatus.APPROVED;
        break;
      case "cancel":
        newStatus = AppointmentStatus.CANCELED;
        break;
      case "update":
      default:
        newStatus = appointment?.status || AppointmentStatus.APPROVED;
        break;
    }

    // Spread values first, then override with computed status and id
    const payload = {
      ...values,
      id: appointment?.id,
      status: newStatus,
    };

    startTransition(() => {
      updateAppointment(payload)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
          if (data.redirect) {
            setOpen?.((prev) => !prev);
            router.refresh();
          }
        })
        .finally(() => {
          console.log("finally");
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {/* Primary Physician */}
        <FormField
          control={form.control}
          name="primaryPhysician"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Physician</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="shad-input">
                    <SelectValue placeholder="Select a physician" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="shad-select-content">
                  {Doctors?.map((doctor) => (
                    <SelectItem key={doctor.name} value={doctor.name}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <Image
                          src={doctor.image}
                          alt={doctor.name}
                          width={32}
                          height={32}
                          className="rounded-full border border-dark-500"
                        />
                        {doctor.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="shad-error" />
            </FormItem>
          )}
        />

        {/* Schedule (Date Picker) */}
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-input-label">Schedule Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  className="shad-input"
                  value={field.value} // Ensure the value is in the correct format
                  onChange={(e) => field.onChange(e.target.value)} // Handle date change
                />
              </FormControl>
              <FormMessage className="shad-error" />
            </FormItem>
          )}
        />

        {/* Reason */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Appointment</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter the reason for your appointment"
                  className="shad-input"
                />
              </FormControl>
              <FormMessage className="shad-error" />
            </FormItem>
          )}
        />

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Any additional notes or details"
                  className="shad-input"
                />
              </FormControl>
              <FormMessage className="shad-error" />
            </FormItem>
          )}
        />

        {/* Cancellation Reason */}
        {type === "cancel" && (
          <FormField
            control={form.control}
            name="cancellationReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Reason</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Cancellation reason or details"
                    className="shad-input"
                  />
                </FormControl>
                <FormMessage className="shad-error" />
              </FormItem>
            )}
          />
        )}

        {/* Login Error */}
        <FormError message={error} />

        {/* submit button */}

        <SubmitButton
          isPending={isPending}
          className={`capitalize text-lg ${
            type === "update"
              ? "bg-green-500 text-gray-900 hover:bg-green-500/70"
              : type === "approve"
              ? "bg-blue-500 text-gray-900 hover:bg-blue-500/70"
              : "bg-red-500 text-gray-900 hover:bg-red-500/70"
          }`}
        >
          {type}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default UpadateAppointmentForm;
