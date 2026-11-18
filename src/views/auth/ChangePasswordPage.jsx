"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Container from "../../components/layout/Container";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PasswordField from "../../components/ui/PasswordField";
import FormAlert from "../../components/ui/FormAlert";
import { changePasswordSchema } from "../../utils/validators";
import { applyApiError } from "../../utils/errors";
import { useChangePassword } from "../../hooks/useAuthActions";

export default function ChangePasswordPage() {
  const router = useRouter();
  const changePassword = useChangePassword();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", password: "", rePassword: "" },
  });

  async function onSubmit(values) {
    setFormError("");
    try {
      await changePassword.mutateAsync(values);
      reset();
      toast.success("Password updated.");
      router.replace("/");
    } catch (error) {
      applyApiError(error, setError, setFormError);
    }
  }

  return (
    <Container className="py-10">
      <Card className="mx-auto max-w-lg">
        <CardHeader
          title="Change password"
          subtitle="Enter your current password, then choose a new one."
        />
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormAlert>{formError}</FormAlert>
          <PasswordField
            id="currentPassword"
            label="Current password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <PasswordField
            id="password"
            label="New password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordField
            id="rePassword"
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.rePassword?.message}
            {...register("rePassword")}
          />
          <Button type="submit" className="w-full" loading={changePassword.isPending}>
            Save password
          </Button>
        </form>
      </Card>
    </Container>
  );
}