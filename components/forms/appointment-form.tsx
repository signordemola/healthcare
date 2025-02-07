"use client";

import { GetAppointmentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Doctors } from "@/constants";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { newAppointment } from "@/actions/newAppointment";
import { Input } from "../ui/input";

const AppointmentForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof GetAppointmentSchema>>({
    resolver: zodResolver(GetAppointmentSchema),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date().toISOString(),
      reason: "",
      note: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof GetAppointmentSchema>) => {
    console.log(values);

    startTransition(() => {
      newAppointment(values)
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
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-8 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Schedule your first appointment</p>
        </section>

        {/* Primary Physician */}
        <FormField
          control={form.control}
          name="primaryPhysician"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Physician</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="shad-input">
                    <SelectValue placeholder="Select a physician" />
                  </SelectTrigger>
                </FormControl>
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
              <FormMessage className="shad-error" />
            </FormItem>
          )}
        />

        {/* Schedule (Date Picker) */}
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-input-label">Schedule Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" className="shad-input border-0" />
              </FormControl>

              <FormMessage className="shad-error" />
            </FormItem>
          )}
        />

        <div className="lg:flex lg:gap-6 space-y-6 lg:space-y-0">
          <div className="lg:w-1/2 w-full">
            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Appointment</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter the reason for your appointment"
                      className="shad-input"
                    />
                  </FormControl>
                  <FormMessage className="shad-error" />
                </FormItem>
              )}
            />
          </div>

          <div className="lg:w-1/2 w-full">
            {/* Note */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Any additional notes or details"
                      className="shad-input"
                    />
                  </FormControl>
                  <FormMessage className="shad-error" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Login Error */}
        <FormError message={error} />

        {/* Login Success */}
        <FormSuccess message={success} />

        {/* submit button */}
        <SubmitButton isPending={isPending}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
