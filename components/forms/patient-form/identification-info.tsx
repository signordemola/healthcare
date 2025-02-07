import React from "react";
import FormWrapper from "./form-wrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PatientDataSchema } from "@/schemas";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doctors } from "@/constants";
import Image from "next/image";

const IdentificationInfo = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PatientDataSchema>();

  const primaryPhysician = watch("primaryPhysician");

  return (
    <FormWrapper title="Identification Info">
      <div className="space-y-4">
        {/* Occupation */}
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            type="text"
            className="shad-input"
            {...register("occupation")}
          />
          {errors.occupation && (
            <span className="shad-error">{errors.occupation.message}</span>
          )}
        </div>

        {/* Emergency Contact Name */}
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
          <Input
            type="text"
            className="shad-input"
            {...register("emergencyContactName")}
          />
          {errors.emergencyContactName && (
            <span className="shad-error">
              {errors.emergencyContactName.message}
            </span>
          )}
        </div>

        {/* Emergency Contact Number */}
        <div className="space-y-2">
          <Label htmlFor="emergencyContactNumber">
            Emergency Contact Number
          </Label>
          <Input
            type="tel"
            className="shad-input"
            {...register("emergencyContactNumber")}
            placeholder="+1234567890"
          />
          {errors.emergencyContactNumber && (
            <span className="shad-error">
              {errors.emergencyContactNumber.message}
            </span>
          )}
        </div>

        {/* Primary Physician */}
        <div className="space-y-2">
          <Label htmlFor="primaryPhysician">Primary Physician</Label>
          <input type="hidden" {...register("primaryPhysician")} />
          <Select
            value={primaryPhysician}
            onValueChange={(value) => {
              setValue("primaryPhysician", value, { shouldValidate: true });
            }}
          >
            <SelectTrigger className="shad-input">
              <SelectValue placeholder="Select a physician" />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {Doctors?.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    {doctor.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-6">
          {/* Identification Type */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="identificationType">Identification Type</Label>
            <Input
              type="text"
              className="shad-input"
              {...register("identificationType")}
            />
            {errors.identificationType && (
              <span className="shad-error">
                {errors.identificationType.message}
              </span>
            )}
          </div>

          {/* Identification Number */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="identificationNumber">Identification Number</Label>
            <Input
              type="tel"
              className="shad-input"
              {...register("identificationNumber")}
            />
            {errors.identificationNumber && (
              <span className="shad-error">
                {errors.identificationNumber.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </FormWrapper>
  );
};

export default IdentificationInfo;
