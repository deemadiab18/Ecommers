"use client";

import { useRouter } from "next/navigation";
import Container from "../components/layout/Container";
import CatalogPageHeader from "../components/catalog/CatalogPageHeader";
import OrderCard from "../components/order/OrderCard";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useUserOrders } from "../hooks/useOrders";
export default function OrdersPage() {
  const router = useRouter();
  const { data: orders = [], isLoading, isError, refetch, isFetching } = useUserOrders();

  if (isLoading) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-12">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <CatalogPageHeader
        title="My orders"
        subtitle={
          isFetching && !isLoading
            ? "Refreshing…"
            : orders.length
              ? `${orders.length} order${orders.length === 1 ? "" : "s"} on your account`
              : "Track payment status and delivery for everything you have purchased."
        }
      />

      {isError ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-sm text-muted">Could not load your orders.</p>
          <Button type="button" className="mt-4" variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : !orders.length ? (
        <EmptyState
          title="No orders yet"
          description="When you place an order, it will show up here."
          actionLabel="Start shopping"
          onAction={() => router.push("/products")}
        />
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}