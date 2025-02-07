"use client";

import React, { useState, useTransition } from "react";
import PersonalInfo from "./patient-form/personal-info";
import MedicalInfo from "./patient-form/medical-info";
import {
  ConsentInfoSchema,
  IdentificationInfoSchema,
  MedicalInfoSchema,
  PatientDataSchema,
  PersonalInfoSchema,
} from "@/schemas";
import { Button } from "../ui/button";
import IdentificationInfo from "./patient-form/identification-info";
import ConsentInfo from "./patient-form/consent-info";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerPatient } from "@/actions/registerPatient";

const PatientRegisterForm = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const methods = useForm<PatientDataSchema>({
    resolver: zodResolver(
      step === 1
        ? PersonalInfoSchema
        : step === 2
        ? MedicalInfoSchema
        : step === 3
        ? IdentificationInfoSchema
        : ConsentInfoSchema
    ),
    defaultValues: {
      birthDate: "",
      gender: "MALE",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      allergies: "",
      currentMedication: "",
      familyMedicalHistory: "",
      pastMedicalHistory: "",
      occupation: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      primaryPhysician: "",
      identificationType: "",
      identificationNumber: "",
      identificationDocument: undefined,
      treatmentConsent: false,
      disclosureConsent: false,
      privacyConsent: false,
    },
    mode: "onBlur", // Validate on blur
  });

  // Define field names for each step
  const stepFields: Record<number, Array<keyof PatientDataSchema>> = {
    1: [
      "birthDate",
      "gender",
      "street",
      "city",
      "state",
      "postalCode",
      "country",
    ], // Step 1: Personal Info
    2: [
      "insuranceProvider",
      "insurancePolicyNumber",
      "allergies",
      "currentMedication",
      "familyMedicalHistory",
      "pastMedicalHistory",
    ], // Step 2: Medical Info
    3: [
      "occupation",
      "emergencyContactName",
      "emergencyContactNumber",
      "primaryPhysician",
      "identificationType",
      "identificationNumber",
    ], // Step 3: Identification Info
    4: [
      "identificationDocument",
      "treatmentConsent",
      "disclosureConsent",
      "privacyConsent",
    ], // Step 4: Consent Info
  };

  const onSubmit = async (data: PatientDataSchema) => {
    console.log("Data: ", data);
    if (step < 4) {
      console.log("Current step fields:", stepFields[step]);
      console.log("Form values:", methods.getValues());

      const isStepValid = await methods.trigger(stepFields[step]);
      console.log("Step validation result:", isStepValid);

      if (!isStepValid) return;
      setStep(step + 1);
    } else {
      // Final submission
      const formData = methods.getValues();
      console.log("Submitted Data:", formData);

      setError("");
      setSuccess("");

      startTransition(() => {
        registerPatient(formData)
          .then((data) => {
            if (data?.error) {
              setError(data.error);
            } else if (data?.success) {
              setSuccess(data.success);
              if (data.redirect) {
                router.push(data.redirect);
              }
            }
          })
          .finally(() => {
            console.log("first");
          });
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {step === 1 && <PersonalInfo />}
        {step === 2 && <MedicalInfo />}
        {step === 3 && <IdentificationInfo />}
        {step === 4 && <ConsentInfo />}

        <br />
        <br />
        {/* Login Error */}
        <FormError message={error} />

        {/* Login Success */}
        <FormSuccess message={success} />

        <div className="mt-6 flex justify-between">
          <Button
            disabled={step === 1 || isPending}
            type="button"
            size={"lg"}
            variant="outline"
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>

          <Button
            type="submit"
            size={"lg"}
            variant="outline"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
                Loading...
              </div>
            ) : (
              `${step === 4 ? "Submit" : "Next"}`
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default PatientRegisterForm;
