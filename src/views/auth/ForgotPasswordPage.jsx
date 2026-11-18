"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import FormAlert from "../../components/ui/FormAlert";
import { emailSchema, resetCodeSchema, newPasswordSchema } from "../../utils/validators";
import { applyApiError } from "../../utils/errors";
import { useForgotPassword, useResetPassword, useVerifyResetCode } from "../../hooks/useAuthActions";
import { RESET_FLOW_KEY } from "../../utils/storage";

function readFlow() {
  try {
    const raw = sessionStorage.getItem(RESET_FLOW_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(() => readFlow()?.step || 1);
  const [email, setEmail] = useState(() => readFlow()?.email || "");
  const [formError, setFormError] = useState("");

  const forgot = useForgotPassword();
  const verify = useVerifyResetCode();
  const reset = useResetPassword();

  const titles = useMemo(
    () => [
      "Reset your password",
      "Check your email",
      "Choose a new password",
    ],
    [],
  );

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email },
  });

  const codeForm = useForm({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: { resetCode: "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", rePassword: "" },
  });

  useEffect(() => {
    const flow = readFlow();
    if (flow?.email) {
      setEmail(flow.email);
      emailForm.setValue("email", flow.email);
    }
    if (flow?.step) setStep(flow.step);
  }, [emailForm]);

  async function submitEmail(values) {
    setFormError("");
    try {
      await forgot.mutateAsync(values);
      setEmail(values.email);
      setStep(2);
      toast.success("Reset code sent — check your inbox.");
    } catch (error) {
      applyApiError(error, emailForm.setError, setFormError);
    }
  }

  async function submitCode(values) {
    setFormError("");
    try {
      await verify.mutateAsync(values);
      setStep(3);
      toast.success("Code verified.");
    } catch (error) {
      applyApiError(error, codeForm.setError, setFormError);
    }
  }

  async function submitPassword(values) {
    setFormError("");
    if (!email) {
      setFormError("Start again from your email address.");
      setStep(1);
      return;
    }
    try {
      await reset.mutateAsync({ email, password: values.password });
      toast.success("Password updated. You can sign in now.");
      router.replace("/login");
    } catch (error) {
      applyApiError(error, passwordForm.setError, setFormError);
    }
  }

  return (
    <AuthLayout
      title={titles[step - 1]}
      subtitle={
        step === 1
          ? "We'll email you a 6-digit code."
          : step === 2
            ? `Enter the code we sent to ${email || "your email"}.`
            : "Pick a strong password for your account."
      }
      footer={
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={n <= step ? "rounded-full bg-mint px-2.5 py-1 text-primary" : "rounded-full bg-surface px-2.5 py-1"}
          >
            Step {n}
          </span>
        ))}
      </div>

      {step === 1 ? (
        <form className="space-y-4" onSubmit={emailForm.handleSubmit(submitEmail)} noValidate>
          <FormAlert>{formError}</FormAlert>
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={emailForm.formState.errors.email?.message}
            {...emailForm.register("email")}
          />
          <Button type="submit" className="w-full" loading={forgot.isPending}>
            Send reset code
          </Button>
        </form>
      ) : null}

      {step === 2 ? (
        <form className="space-y-4" onSubmit={codeForm.handleSubmit(submitCode)} noValidate>
          <FormAlert>{formError}</FormAlert>
          <TextField
            id="resetCode"
            label="6-digit code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            error={codeForm.formState.errors.resetCode?.message}
            {...codeForm.register("resetCode")}
          />
          <Button type="submit" className="w-full" loading={verify.isPending}>
            Verify code
          </Button>
          <button
            type="button"
            className="w-full text-sm font-medium text-muted hover:text-primary"
            onClick={() => setStep(1)}
          >
            Use a different email
          </button>
        </form>
      ) : null}

      {step === 3 ? (
        <form className="space-y-4" onSubmit={passwordForm.handleSubmit(submitPassword)} noValidate>
          <FormAlert>{formError}</FormAlert>
          <PasswordField
            id="password"
            label="New password"
            autoComplete="new-password"
            error={passwordForm.formState.errors.password?.message}
            {...passwordForm.register("password")}
          />
          <PasswordField
            id="rePassword"
            label="Confirm new password"
            autoComplete="new-password"
            error={passwordForm.formState.errors.rePassword?.message}
            {...passwordForm.register("rePassword")}
          />
          <Button type="submit" className="w-full" loading={reset.isPending}>
            Update password
          </Button>
        </form>
      ) : null}
    </AuthLayout>
  );
}