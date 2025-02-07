import { Button } from "@/components/ui/button";
import { getAppointment } from "@/lib/dal";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SuccessPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}
const SuccessPage = async ({ searchParams }: SuccessPageProps) => {
  const params = await searchParams;
  const appointmentId = params.appointmentId;

  if (!appointmentId) return null

  const appointment = await getAppointment(appointmentId as string);
  return (
    <section className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href={`/`}>
          <Image
            src={`/assets/icons/logo-full.svg`}
            height={1000}
            width={1000}
            alt="icon"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src={`/assets/gifs/success.gif`}
            height={300}
            width={200}
            alt="success"
            unoptimized
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted
          </h2>
          <br />
          <p>We will be in touch shortly to confirm</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-2">
            <Image
              src={`/assets/icons/calendar.svg`}
              height={24}
              width={24}
              alt="calendar"
            />
            <p className="font-semibold">
              {appointment?.schedule
                ? new Date(appointment.schedule).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "No schedule available"}
            </p>
          </div>
        </section>

        <Button variant={`outline`} className="shadow-primary-btn" asChild>
          <Link href={`/patient`}>My Appointments</Link>
        </Button>
      </div>
    </section>
  );
};

export default SuccessPage;
