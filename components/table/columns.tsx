"use client";
import { ColumnDef } from "@tanstack/react-table";
import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";
import { AppointmentStatus } from "@prisma/client";
import { Button } from "../ui/button";
import DeleteButton from "../delete-button";

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

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-medium ">{appointment.patient.user.fullName}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Date",
    cell: ({ row }) => {
      const appointment = row.original;
      const formattedDate = new Date(appointment.schedule).toLocaleDateString();
      return <p className="text-14-regular min-w-[100px]">{formattedDate}</p>;
    },
  },
  {
    accessorKey: "primaryPhysicianName",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap">Dr. {appointment.physician.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <div className="flex gap-1">
            {appointment.status === "APPROVED" ? (
              <AppointmentModal
                appointment={appointment}
                type="update"
                title="Update Appointment"
                description="Please confirm the following details to update."
              />
            ) : appointment.status === "SCHEDULED" ? (
              <AppointmentModal
                appointment={appointment}
                type="approve"
                title="Approve Appointment"
                description="Please confirm the following details to schedule."
              />
            ) : (
              ""
            )}
          </div>

          <div>
            {appointment?.status === "CANCELED" ? (
              <div className="flex gap-3">
                <Button disabled variant={`disabled`}>
                  Cancelled
                </Button>

                <DeleteButton id={appointment?.id}/>
              </div>
            ) : (
              <AppointmentModal
                appointment={appointment}
                type="cancel"
                title="Cancel Appointment"
                description="Are you sure you want to cancel your appointment?"
              />
            )}
          </div>
        </div>
      );
    },
  },
];
