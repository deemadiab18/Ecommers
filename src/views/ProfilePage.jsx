"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Package } from "lucide-react";
import Container from "../components/layout/Container";
import CatalogPageHeader from "../components/catalog/CatalogPageHeader";
import Card, { CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import FormAlert from "../components/ui/FormAlert";
import AddressManager from "../components/profile/AddressManager";
import { profileSchema } from "../utils/validators";
import { applyApiError } from "../utils/errors";
import { useAuth } from "../context/AuthContext";
import { useUpdateProfile } from "../hooks/useProfileActions";
export default function ProfilePage() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    });
  }, [user, reset]);

  async function onSubmit(values) {
    setFormError("");
    try {
      await updateProfile.mutateAsync(values);
    } catch (error) {
      applyApiError(error, setError, setFormError);
    }
  }

  return (
    <Container className="py-10">
      <CatalogPageHeader
        title="My profile"
        subtitle="Update your details and manage delivery addresses for faster checkout."
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/profile/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-primary/30 hover:bg-mint"
        >
          <Package className="size-4 text-primary" aria-hidden />
          My orders
        </Link>
        <Link
          href="/change-password"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-primary/30 hover:bg-mint"
        >
          <KeyRound className="size-4 text-primary" aria-hidden />
          Change password
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader title="Account details" subtitle="Name, email, and phone on your FreshCart account." />
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormAlert>{formError}</FormAlert>
            <TextField id="profile-name" label="Full name" error={errors.name?.message} {...register("name")} />
            <TextField
              id="profile-email"
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <TextField
              id="profile-phone"
              label="Phone"
              inputMode="tel"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Button type="submit" loading={updateProfile.isPending}>
              Save changes
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Addresses" subtitle="Saved for checkout — add or remove anytime." />
          <AddressManager />
        </Card>
      </div>
    </Container>
  );
}