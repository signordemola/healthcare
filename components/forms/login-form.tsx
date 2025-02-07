"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import Image from "next/image";
import SubmitButton from "../SubmitButton";
import { useState, useTransition } from "react";
import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
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
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex-1"
      >
        <section className="mb-8 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment</p>
        </section>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-input-label">Email</FormLabel>
              <div className="flex rounded-md border border-dark-500 bg-dark-400">
                <Image
                  src={`/assets/icons/email.svg`}
                  alt="email icon"
                  height={24}
                  width={24}
                  className="ml-2"
                />
                <FormControl>
                  <Input
                    {...field}
                    placeholder="example@email.com"
                    type="email"
                    className="shad-input border-0"
                  />
                </FormControl>
              </div>

              <FormMessage className="shad-error" />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-input-label">Password</FormLabel>
              <div className="flex rounded-md border border-dark-500 bg-dark-400">
                <Image
                  src={`/assets/icons/password.svg`}
                  alt="fullname icon"
                  height={24}
                  width={24}
                  className="ml-2"
                />
                <FormControl>
                  <Input
                    {...field}
                    placeholder="*********"
                    type="password"
                    className="shad-input border-0 my-[2px]"
                  />
                </FormControl>
              </div>

              <FormMessage className="shad-error" />
            </FormItem>
          )}
        />

        {/* Login Error */}
        <FormError message={error} />

        {/* Login Success */}
        <FormSuccess message={success} />

        {/* submit button */}
        <SubmitButton isPending={isPending}>Log in</SubmitButton>
      </form>
    </Form>
  );
};

export default LoginForm;
