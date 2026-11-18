"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import FormAlert from "../../components/ui/FormAlert";
import { registerSchema } from "../../utils/validators";
import { applyApiError } from "../../utils/errors";
import { useSignUp } from "../../hooks/useAuthActions";

export default function RegisterPage() {
  const router = useRouter();
  const signUp = useSignUp();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
      terms: false,
    },
  });

  async function onSubmit(values) {
    setFormError("");
    try {
      await signUp.mutateAsync(values);
      toast.success("Account created!");
      router.replace("/");
    } catch (error) {
      applyApiError(error, setError, setFormError);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join FreshCart for farm-fresh delivery across Cairo."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormAlert>{formError}</FormAlert>
        <TextField id="name" label="Full name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="01012345678"
          hint="Egyptian mobile — 01XXXXXXXXX"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          hint="At least 8 characters with a number and a symbol."
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordField
          id="rePassword"
          label="Confirm password"
          autoComplete="new-password"
          error={errors.rePassword?.message}
          {...register("rePassword")}
        />
        <label className="flex items-start gap-2 text-sm text-muted">
          <input type="checkbox" className="mt-0.5 size-4 rounded border-line text-primary" {...register("terms")} />
          <span>
            I agree to the <span className="text-ink">Terms &amp; Privacy Policy</span>
          </span>
        </label>
        {errors.terms?.message ? <p className="text-xs text-discount">{errors.terms.message}</p> : null}
        <Button type="submit" className="w-full" loading={signUp.isPending}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}