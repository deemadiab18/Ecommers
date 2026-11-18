"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CheckCircle2, CreditCard, MapPin } from "lucide-react";
import Container from "../components/layout/Container";
import CatalogPageHeader from "../components/catalog/CatalogPageHeader";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import Spinner from "../components/ui/Spinner";
import Card from "../components/ui/Card";
import OrderCard from "../components/order/OrderCard";
import { shippingAddressSchema } from "../utils/validators";
import { useCartSummary } from "../hooks/useCart";
import { useAddresses } from "../hooks/useAddresses";
import { usePlaceCashOrder, useStartOnlineCheckout } from "../hooks/useCheckout";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";
import { getApiError } from "../utils/errors";

function formatEgp(value) {
  return `${(Number(value) || 0).toLocaleString("en-EG")} EGP`;
}

export default function CheckoutPage() {
  const { cartId: cartIdParam } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { data: cart, isLoading: cartLoading, isError: cartError, refetch: refetchCart } = useCartSummary();
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const cashOrder = usePlaceCashOrder();
  const onlineCheckout = useStartOnlineCheckout();

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [formError, setFormError] = useState("");

  const lines = cart?.products ?? [];
  const cartId = cart?.cartId;
  const cartMismatch = Boolean(cartId && cartIdParam && cartId !== cartIdParam);

  const selectedAddress = useMemo(
    () => addresses.find((item) => item._id === selectedAddressId) ?? null,
    [addresses, selectedAddressId],
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: { details: "", phone: user?.phone ?? "", city: "" },
  });

  useEffect(() => {
    if (!selectedAddress) return;
    setValue("details", selectedAddress.details);
    setValue("phone", selectedAddress.phone);
    setValue("city", selectedAddress.city);
  }, [selectedAddress, setValue]);

  function pickAddress(id) {
    setSelectedAddressId(id);
    const address = addresses.find((item) => item._id === id);
    if (address) {
      reset({ details: address.details, phone: address.phone, city: address.city });
    }
  }

  function useNewAddress() {
    setSelectedAddressId("");
    reset({ details: "", phone: user?.phone ?? "", city: "" });
  }

  async function onSubmit(values) {
    setFormError("");
    if (!cartId) {
      setFormError("Your cart is not ready for checkout. Add items and try again.");
      return;
    }
    const shippingAddress = {
      details: values.details.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
    };

    try {
      if (paymentMethod === "cash") {
        const order = await cashOrder.mutateAsync({ cartId, shippingAddress, userId: user?.id });
        setPlacedOrder(order);
        return;
      }
      const session = await onlineCheckout.mutateAsync({ cartId, shippingAddress });
      if (session?.url) {
        window.location.href = session.url;
        return;
      }
      setFormError("Payment session could not be started. Try again or choose cash on delivery.");
    } catch (error) {
      setFormError(getApiError(error).message);
    }
  }

  const busy = cashOrder.isPending || onlineCheckout.isPending;

  if (placedOrder) {
    return (
      <Container className="py-10">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <CheckCircle2 className="mx-auto size-16 text-primary" aria-hidden />
          <h1 className="text-2xl font-bold text-ink">Order placed successfully</h1>
          <p className="text-sm text-muted">We will contact you to confirm delivery. You can track the order in My orders.</p>
          <OrderCard order={placedOrder} />
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/allorders">
              <Button type="button">View my orders</Button>
            </Link>
            <Link href="/products">
              <Button type="button" variant="secondary">
                Continue shopping
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (cartLoading) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-12">
        <Spinner />
      </Container>
    );
  }

  if (cartError) {
    return (
      <Container className="py-12">
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-sm text-muted">Could not load your cart.</p>
          <Button type="button" className="mt-4" variant="secondary" onClick={() => refetchCart()}>
            Try again
          </Button>
        </div>
      </Container>
    );
  }

  if (!lines.length) {
    return (
      <Container className="py-10">
        <CatalogPageHeader title="Checkout" subtitle="Your cart is empty." />
        <Card className="mx-auto max-w-lg text-center">
          <p className="text-sm text-muted">Add products before checking out.</p>
          <Button type="button" className="mt-4" onClick={() => router.push("/products")}>
            Go to shop
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <CatalogPageHeader
        title="Checkout"
        subtitle={`Delivering ${cart?.numOfCartItems ?? lines.length} item${lines.length === 1 ? "" : "s"} · Total ${formatEgp(cart?.totalCartPrice)}`}
      />

      {cartMismatch ? (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          This link uses an older cart id. Checkout will use your current cart.
        </p>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-ink">Shipping address</h2>
            {addressesLoading ? (
              <p className="text-sm text-muted">Loading saved addresses…</p>
            ) : addresses.length ? (
              <ul className="space-y-2">
                {addresses.map((address) => (
                  <li key={address._id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                        selectedAddressId === address._id
                          ? "border-primary bg-mint"
                          : "border-line bg-white hover:border-primary/40",
                      )}
                      onClick={() => pickAddress(address._id)}
                    >
                      <p className="text-sm font-semibold text-ink">{address.name}</p>
                      <p className="mt-1 text-sm text-muted">
                        {address.details}, {address.city} · {address.phone}
                      </p>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium",
                      !selectedAddressId ? "border-primary bg-mint text-primary" : "border-line text-ink hover:bg-surface",
                    )}
                    onClick={useNewAddress}
                  >
                    Use a different address
                  </button>
                </li>
              </ul>
            ) : (
              <p className="text-sm text-muted">No saved addresses yet — enter delivery details below. You can save addresses from your profile later.</p>
            )}

            <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                <MapPin className="size-4 text-primary" aria-hidden />
                Delivery details
              </p>
              <TextField
                id="checkout-details"
                label="Address"
                placeholder="Street, building, apartment"
                error={errors.details?.message}
                {...register("details")}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="checkout-city"
                  label="City"
                  error={errors.city?.message}
                  {...register("city")}
                />
                <TextField
                  id="checkout-phone"
                  label="Phone"
                  inputMode="tel"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink">Payment</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <PaymentOption
                active={paymentMethod === "cash"}
                onPick={() => setPaymentMethod("cash")}
                icon={Banknote}
                title="Cash on delivery"
                text="Pay when your order arrives."
              />
              <PaymentOption
                active={paymentMethod === "card"}
                onPick={() => setPaymentMethod("card")}
                icon={CreditCard}
                title="Pay online"
                text="Secure checkout with Stripe."
              />
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-line bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-ink">Order summary</h2>
          <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {lines.map((line) => (
              <li key={line.product?._id ?? line._id} className="text-sm">
                <span className="font-medium text-ink">{line.product?.title ?? "Product"}</span>
                <span className="text-muted"> × {line.count}</span>
                <span className="float-right font-semibold text-ink">
                  {(Number(line.price) * line.count).toLocaleString("en-EG")} EGP
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatEgp(cart?.totalCartPrice)}</span>
          </div>

          {formError ? (
            <p className="text-sm text-discount" role="alert">
              {formError}
            </p>
          ) : null}

          <Button type="submit" className="w-full" loading={busy}>
            {paymentMethod === "cash" ? "Place order" : "Continue to payment"}
          </Button>
          <Link href="/cart" className="block text-center text-sm font-medium text-primary hover:underline">
            Back to cart
          </Link>
        </aside>
      </form>
    </Container>
  );
}

function PaymentOption({ active, onPick, icon: Icon, title, text }) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-2xl border p-4 text-left transition-colors",
        active ? "border-primary bg-mint" : "border-line bg-white hover:border-primary/40",
      )}
      onClick={onPick}
    >
      <Icon className={cn("size-6", active ? "text-primary" : "text-muted")} aria-hidden />
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs text-muted">{text}</p>
    </button>
  );
}
