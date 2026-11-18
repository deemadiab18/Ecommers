"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import FormAlert from "../ui/FormAlert";
import StarRating from "./StarRating";
import RatingPicker from "./RatingPicker";
import { reviewSchema } from "../../utils/validators";
import { applyApiError } from "../../utils/errors";
import { useAuth } from "../../context/AuthContext";
import { useProductReviews, useReviewMutations } from "../../hooks/useReviews";

export default function ProductReviews({ productId }) {
  const { user, status } = useAuth();
  const signedIn = status === "authenticated";
  const { data, isLoading, isError, refetch } = useProductReviews(productId, { limit: 20, page: 1 });
  const { add, update, remove } = useReviewMutations(productId);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  const reviews = data?.items ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { review: "", rating: 5 },
  });

  const rating = watch("rating");

  async function onSubmit(values) {
    setFormError("");
    try {
      if (editingId) {
        await update.mutateAsync({ id: editingId, ...values });
        setEditingId(null);
      } else {
        await add.mutateAsync(values);
      }
      reset({ review: "", rating: 5 });
    } catch (error) {
      applyApiError(error, setError, setFormError);
    }
  }

  function startEdit(review) {
    setEditingId(review._id);
    reset({ review: review.review, rating: review.rating });
    setFormError("");
  }

  function cancelEdit() {
    setEditingId(null);
    reset({ review: "", rating: 5 });
    setFormError("");
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink">Customer reviews</h2>
        <p className="mt-1 text-sm text-muted">
          {data?.results ?? reviews.length} {data?.results === 1 ? "review" : "reviews"}
        </p>
      </div>

      {isLoading ? <p className="text-sm text-muted">Loading reviews…</p> : null}
      {isError ? (
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="text-sm text-muted">Could not load reviews.</p>
          <Button type="button" className="mt-3" variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && reviews.length === 0 ? (
        <p className="text-sm text-muted">No reviews yet — be the first to share your experience.</p>
      ) : null}

      <ul className="space-y-3">
        {reviews.map((review) => {
          const owns = signedIn && review.user?._id === user?.id;
          return (
            <li key={review._id}>
              <Card className="p-4 shadow-none sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">{review.user?.name || "Customer"}</p>
                    <StarRating value={review.rating} className="mt-1" />
                  </div>
                  {owns ? (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-line hover:bg-surface"
                        aria-label="Edit review"
                        onClick={() => startEdit(review)}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-line text-discount hover:bg-red-50"
                        aria-label="Delete review"
                        disabled={remove.isPending}
                        onClick={() => remove.mutate(review._id)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">{review.review}</p>
              </Card>
            </li>
          );
        })}
      </ul>

      {signedIn ? (
        <Card className="shadow-none">
          <h3 className="text-lg font-semibold text-ink">{editingId ? "Edit your review" : "Write a review"}</h3>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormAlert>{formError}</FormAlert>
            <RatingPicker value={Number(rating)} onChange={(value) => setValue("rating", value, { shouldValidate: true })} />
            {errors.rating?.message ? <p className="text-xs text-discount">{errors.rating.message}</p> : null}
            <TextField
              id="review-text"
              label="Review"
              error={errors.review?.message}
              {...register("review")}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" loading={add.isPending || update.isPending}>
                {editingId ? "Update review" : "Post review"}
              </Button>
              {editingId ? (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Card>
      ) : (
        <p className="text-sm text-muted">Sign in to leave a review.</p>
      )}
    </section>
  );
}