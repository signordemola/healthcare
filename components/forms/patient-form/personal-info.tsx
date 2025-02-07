"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import FormWrapper from "./form-wrapper";
import { COUNTRIES } from "@/constants";
import { useFormContext } from "react-hook-form";
import { PatientDataSchema } from "@/schemas";

const PersonalInfo = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PatientDataSchema>();

  const gender = watch("gender");
  const country = watch("country");
  return (
    <FormWrapper title="Personal Info">
      <div className="space-y-4">
        <div className="flex gap-6">
          {/* Birth Date */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="birthDate">Date of Birth</Label>
            <Input
              {...register("birthDate")}
              className="shad-input"
              type="date"
            />
            {/* <FormMessage  className="shad-error" /> */}
            {errors.birthDate && (
              <span className="shad-error">{errors.birthDate.message}</span>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="gender">Gender</Label>
            <input type="hidden" {...register("gender")} />
            <Select
              value={gender || ""}
              onValueChange={(value) => {
                setValue("gender", value as "MALE" | "FEMALE" | "OTHER", {
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="shad-select-content">
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>

            {errors.gender && (
              <span className="shad-error">{errors.gender.message}</span>
            )}
          </div>
        </div>

        {/* Street */}
        <div className="space-y-2">
          <Label htmlFor="street">Street</Label>
          <Input type="text" className="shad-input" {...register("street")} />

          {errors.street && (
            <span className="shad-error">{errors.street.message}</span>
          )}
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input type="text" className="shad-input" {...register("city")} />
          {errors.city && (
            <span className="shad-error">{errors.city.message}</span>
          )}
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input type="text" className="shad-input" {...register("state")} />
          {errors.state && (
            <span className="shad-error">{errors.state.message}</span>
          )}
        </div>

        <div className="flex gap-6">
          {/* Postal Code */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              type="text"
              className="shad-input"
              {...register("postalCode")}
            />
            {errors.postalCode && (
              <span className="shad-error">{errors.postalCode.message}</span>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2 w-1/2">
            <Label htmlFor="country">Country</Label>
            <input type="hidden" {...register("country")} />
            <Select
              value={country || ""}
              onValueChange={(value) => {
                setValue("country", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="shad-select-content">
                {COUNTRIES?.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </FormWrapper>
  );
};

export default PersonalInfo;
