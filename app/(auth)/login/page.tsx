import Image from "next/image";
import React from "react";
import logo from "../../../public/assets/icons/logo-full.svg";
import onboarding from "../../../public/assets/images/onboarding-img.png";
import LoginForm from "@/components/forms/login-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src={logo}
            width={1000}
            height={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          {/* login form */}
          <LoginForm />

          <div className="text-14-regular mt-20 flex justify-between items-center">
            <p className="justify-items-end text-dark-600 xl:text-left">
              2024 CarePulse
            </p>

            <Link href={`/`}>
              <Button variant={`outline`}>Sign Up</Button>
            </Link>
          </div>
        </div>
      </section>

      <Image
        src={onboarding}
        alt="onboardin"
        height={1000}
        width={1000}
        className="side-img max-w-[50%]"
      />
    </main>
  );
};

export default LoginPage;
