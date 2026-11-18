"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import Spinner from "../ui/Spinner";
import EmptyState from "../ui/EmptyState";
import { addressSchema } from "../../utils/validators";
import { useAddresses } from "../../hooks/useAddresses";
import { useAddAddress, useRemoveAddress } from "../../hooks/useProfileActions";

export default function AddressManager() {
  const { data: addresses = [], isLoading, isError, refetch } = useAddresses();
  const addAddress = useAddAddress();
  const removeAddress = useRemoveAddress();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { name: "", details: "", phone: "", city: "" },
  });

  async function onSubmit(values) {
    await addAddress.mutateAsync(values);
    reset();
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-line bg-surface p-4 text-center">
          <p className="text-sm text-muted">Could not load addresses.</p>
          <Button type="button" className="mt-3" variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : !addresses.length ? (
        <EmptyState
          title="No saved addresses"
          description="Add an address to reuse it at checkout."
        />
      ) : (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li
              key={address._id}
              className="flex gap-3 rounded-xl border border-line bg-surface/50 p-4"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{address.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {address.details}, {address.city} · {address.phone}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-discount disabled:opacity-40"
                aria-label={`Remove ${address.name}`}
                disabled={removeAddress.isPending}
                onClick={() => removeAddress.mutate(address._id)}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="space-y-4 border-t border-line pt-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3 className="text-sm font-semibold text-ink">Add address</h3>
        <TextField id="addr-name" label="Label" placeholder="Home, office…" error={errors.name?.message} {...register("name")} />
        <TextField
          id="addr-details"
          label="Address"
          placeholder="Street, building, apartment"
          error={errors.details?.message}
          {...register("details")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="addr-city" label="City" error={errors.city?.message} {...register("city")} />
          <TextField id="addr-phone" label="Phone" inputMode="tel" error={errors.phone?.message} {...register("phone")} />
        </div>
        <Button type="submit" variant="secondary" loading={addAddress.isPending}>
          Save address
        </Button>
      </form>
    </div>
  );
}