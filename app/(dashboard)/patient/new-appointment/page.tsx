import AppointmentForm from "@/components/forms/appointment-form";
import { verifySession } from "@/lib/dal";
import Image from "next/image";
import React from "react";

const NewAppointmentPage = async () => {
  const session = await verifySession();
  if (!session) return null;

  return (
    <section className="flex h-screen max-h-screen">
      <div className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[750px] flex-1 justify-between">
          <Image
            src={`/assets/icons/logo-full.svg`}
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {/* appointment form */}
          <AppointmentForm />

          <div className="text-14-regular mt-20 flex justify-between items-center">
            <p className="justify-items-end text-dark-600 xl:text-left">
              2024 CarePulse
            </p>
          </div>
        </div>
      </div>

      <Image
        src={`/assets/images/appointment-img.png`}
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[500px] bg-bottom"
      />
    </section>
  );
};

export default NewAppointmentPage;
