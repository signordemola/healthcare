import LogOutButton from "@/components/log-out-btn";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import logo from "@/public/assets/icons/logo-full.svg";
import { Button } from "@/components/ui/button";

const PatientPage = () => {
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
            Start the day with managing or booking new appointments
          </p>
        </section>

        <>
          <Link href={`/patient/new-appointment`}>
            <Button variant={`outline`} size={`lg`}>Book an appointment</Button>
          </Link>
        </>
      </main>
    </div>
  );
};

export default PatientPage;
