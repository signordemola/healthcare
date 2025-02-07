import React from "react";
import FormWrapper from "./form-wrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PatientDataSchema } from "@/schemas";
import { useFormContext } from "react-hook-form";

const ConsentInfo = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PatientDataSchema>();

  const treatmentConsent = watch("treatmentConsent");
  const disclosureConsent = watch("disclosureConsent");
  const privacyConsent = watch("privacyConsent");
  return (
    <FormWrapper title="Consent Info">
      <div className="space-y-10">
        {/* Identification Document */}
        <div className="space-y-2">
          <Label htmlFor="identificationDocument">
            Identification Document
          </Label>
          <Input
            type="file"
            className="shad-input"
            onChange={(e) => {
              const files = e.target.files
                ? Array.from(e.target.files)
                : undefined;
              setValue("identificationDocument", files, {
                shouldValidate: true,
              });
            }}
            multiple
          />
          {errors.identificationDocument && (
            <span className="shad-error">
              {errors.identificationDocument.message}
            </span>
          )}
        </div>

        {/* Treatment Consent */}
        <div className="flex items-center space-x-3">
          <Checkbox
            className="shad-input-check"
            checked={treatmentConsent}
            onCheckedChange={(checked) =>
              setValue("treatmentConsent", !!checked, { shouldValidate: true })
            }
          />
          <Label htmlFor="treatmentConsent">I consent to treatment.</Label>
          {errors.treatmentConsent && (
            <span className="shad-error">
              {errors.treatmentConsent.message}
            </span>
          )}
        </div>

        {/* Disclosure Consent */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="disclosureConsent"
            className="shad-input-check"
            checked={disclosureConsent}
            onCheckedChange={(checked) =>
              setValue("disclosureConsent", !!checked, { shouldValidate: true })
            }
          />
          <Label htmlFor="disclosureConsent">
            I consent to disclosure of my medical information.
          </Label>
          {errors.disclosureConsent && (
            <span className="shad-error">
              {errors.disclosureConsent.message}
            </span>
          )}
        </div>

        {/* Privacy Consent */}
        <div className="flex items-center space-x-3">
          <Checkbox
            className="shad-input-check"
            checked={privacyConsent}
            onCheckedChange={(checked) =>
              setValue("privacyConsent", !!checked, { shouldValidate: true })
            }
          />
          <Label htmlFor="privacyConsent">
            I consent to the privacy policy.
          </Label>

          {errors.privacyConsent && (
            <span className="shad-error">{errors.privacyConsent.message}</span>
          )}
        </div>
      </div>
    </FormWrapper>
  );
};

export default ConsentInfo;
