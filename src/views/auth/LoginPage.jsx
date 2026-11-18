"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import FormAlert from "../../components/ui/FormAlert";
import { loginSchema } from "../../utils/validators";
import { applyApiError } from "../../utils/errors";
import { useSignIn } from "../../hooks/useAuthActions";
import { resolveReturnPath } from "../../utils/redirect";
import { REMEMBER_EMAIL_KEY } from "../../utils/storage";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signIn = useSignIn();
  const [formError, setFormError] = useState("");

  const remembered =
    typeof window !== "undefined" ? localStorage.getItem(REMEMBER_EMAIL_KEY) || "" : "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: remembered, password: "", remember: Boolean(remembered) },
  });

  async function onSubmit(values) {
    setFormError("");
    try {
      await signIn.mutateAsync({ email: values.email, password: values.password });
      if (values.remember) localStorage.setItem(REMEMBER_EMAIL_KEY, values.email.trim());
      else localStorage.removeItem(REMEMBER_EMAIL_KEY);
      toast.success("Welcome back!");
      router.replace(resolveReturnPath({ from: searchParams.get("from") }));
    } catch (error) {
      applyApiError(error, setError, setFormError);
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back — pick up where you left off."
      footer={
        <>
          New to FreshCart?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormAlert>{formError}</FormAlert>
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center gap-2 text-muted">
            <input type="checkbox" className="size-4 rounded border-line text-primary" {...register("remember")} />
            Remember email
          </label>
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={signIn.isPending}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}