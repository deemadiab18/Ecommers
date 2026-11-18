"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import Container from "../layout/Container";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import { emailSchema } from "../../utils/validators";

export default function NewsletterBlock() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit() {
    toast.success("Thanks — you're on the list!");
    setDone(true);
    reset();
    window.setTimeout(() => setDone(false), 4000);
  }

  return (
    <section className="border-t border-line bg-mint/40 py-12">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-6 text-center shadow-card sm:p-8">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-mint text-primary">
            <Mail className="size-5" aria-hidden />
          </span>
          <h2 className="mt-4 text-2xl font-bold text-ink">Stay in the loop</h2>
          <p className="mt-2 text-sm text-muted">
            Get weekly deals, new arrivals, and delivery updates. No spam — unsubscribe anytime.
          </p>
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="flex-1 text-left"
              error={errors.email?.message}
              {...register("email")}
            />
            <Button type="submit" className="shrink-0 sm:min-w-32" loading={isSubmitting} disabled={done}>
              {done ? "Subscribed" : "Subscribe"}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}