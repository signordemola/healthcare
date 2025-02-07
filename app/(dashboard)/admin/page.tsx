import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";

import logo from "@/public/assets/icons/logo-full.svg";
import approvedSvg from "@/public/assets/icons/appointments.svg";
import pendingSvg from "@/public/assets/icons/pending.svg";
import cancelledSvg from "@/public/assets/icons/cancelled.svg";

import { getAllAppointmentsDetails, verifySession } from "@/lib/dal";
import { AppointmentStatus } from "@prisma/client";
import LogOutButton from "@/components/log-out-btn";

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

const AdminPage = async () => {
  const session = await verifySession();
  if (!session) {
    return null;
  }

  const rawAppointments = await getAllAppointmentsDetails();

  if (!rawAppointments) {
    return <div>Failed to fetch appointments.</div>;
  }

  const appointments: Appointment[] = rawAppointments.map((appt) => ({
    ...appt,
    patientName: appt.patient.user.fullName, // Extract patient name
    primaryPhysicianName: appt.physician.name, // Extract physician name
  }));

  const statusCounts = {
    SCHEDULED: 0,
    APPROVED: 0,
    CANCELED: 0,
  } as Record<AppointmentStatus, number>;

  appointments.forEach((appt) => {
    if (appt.status in statusCounts) {
      statusCounts[appt.status]++;
    }
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src={logo}
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <div className="">
          <LogOutButton />
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={statusCounts.APPROVED}
            label="Approved Appointments"
            icon={approvedSvg}
          />
          <StatCard
            type="pending"
            count={statusCounts.SCHEDULED}
            label="Scheduled Appointments"
            icon={pendingSvg}
          />
          <StatCard
            type="cancelled"
            count={statusCounts.CANCELED}
            label="Cancelled Appointments"
            icon={cancelledSvg}
          />
        </section>

        <DataTable columns={columns} data={appointments} />
      </main>
    </div>
  );
};

export default AdminPage;
