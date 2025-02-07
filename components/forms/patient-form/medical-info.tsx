"use client";

import { Label } from "@/components/ui/label";
import FormWrapper from "./form-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PatientDataSchema } from "@/schemas";
import { useFormContext } from "react-hook-form";

const MedicalInfo = () => {
  const {
    register,
    // setValue,
    // watch,
    formState: { errors },
  } = useFormContext<PatientDataSchema>();
  return (
    <FormWrapper title="Medical Info">
      <div className="space-y-4">
        <div className="flex gap-6">
          {/* Insurance Provider */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            <Input
              type="text"
              className="shad-input"
              {...register("insuranceProvider")}
            />
            {errors.insuranceProvider && (
              <span className="shad-error">
                {errors.insuranceProvider.message}
              </span>
            )}
          </div>

          {/* Insurance Policy Number */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="insurancePolicyNumber">
              Insurance Policy Number
            </Label>
            <Input
              type="text"
              className="shad-input"
              {...register("insurancePolicyNumber")}
            />
            {errors.insurancePolicyNumber && (
              <span className="shad-error">
                {errors.insurancePolicyNumber.message}
              </span>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea className="shad-textArea" {...register("allergies")} />
          {errors.allergies && (
            <span className="shad-error">{errors.allergies.message}</span>
          )}
        </div>

        {/* Current Medication */}
        <div className="space-y-2">
          <Label htmlFor="currentMedication">Current Medication</Label>
          <Textarea
            className="shad-textArea"
            {...register("currentMedication")}
          />
          {errors.currentMedication && (
            <span className="shad-error">
              {errors.currentMedication.message}
            </span>
          )}
        </div>

        <div className="flex gap-6">
          {/* Family Medical History */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="familyMedicalHistory">Family Medical History</Label>
            <Textarea
              className="shad-textArea"
              {...register("familyMedicalHistory")}
            />
            {errors.familyMedicalHistory && (
              <span className="shad-error">
                {errors.familyMedicalHistory.message}
              </span>
            )}
          </div>

          {/* Past Medical History */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="pastMedicalHistory">Past Medical History</Label>
            <Textarea
              className="shad-textArea"
              {...register("pastMedicalHistory")}
            />
            {errors.pastMedicalHistory && (
              <span className="shad-error">
                {errors.pastMedicalHistory.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </FormWrapper>
  );
};

export default MedicalInfo;
