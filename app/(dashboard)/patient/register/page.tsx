import PatientRegisterForm from "@/components/forms/patient-register-form";
// import {
//   getPatient,
//   verifySession,
// } from "@/lib/dal";
import Image from "next/image";
import React from "react";

const PatientRegisterPage = async () => {
  // const session = await verifySession();
  // if (!session) return null;

  // const patient = await getPatient();

  // if (patient) return <>Patient Registered</>;

  // console.log(patient)

  return (
    <main className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[760px]">
          <Image
            src={`/assets/icons/logo-full.svg`}
            width={1000}
            height={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          {/* patient register form */}
          <PatientRegisterForm />

          <div className="text-14-regular mt-20 flex justify-between items-center">
            <p className="justify-items-end text-dark-600 xl:text-left">
              2024 CarePulse
            </p>

            {/* <Link href={`/`}>
              <Button variant={`outline`}>Sign Up</Button>
            </Link> */}
          </div>
        </div>
      </section>

      <Image
        src={`/assets/images/register-img.png`}
        alt="patient"
        height={1000}
        width={1000}
        className="side-img max-w-[390px]"
      />
    </main>
  );
};

export default PatientRegisterPage;
