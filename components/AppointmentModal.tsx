"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import "react-datepicker/dist/react-datepicker.css";
import { AppointmentStatus } from "@prisma/client";
import UpadateAppointmentForm from "./forms/update-appointment-form";

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

export const AppointmentModal = ({
  appointment,
  type,
  title,
  description,
}: {
  appointment?: Appointment;
  type: "update" | "approve" | "cancel";
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ml-2 min-w-24 ${
            type === "approve"
              ? "text-blue-500 border border-blue-500/30"
              : type === "update"
              ? "text-green-500 border border-green-500/30"
              : "text-destructive border border-destructive/30 "
          }`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <UpadateAppointmentForm appointment={appointment} type={type} />
      </DialogContent>
    </Dialog>
  );
};
