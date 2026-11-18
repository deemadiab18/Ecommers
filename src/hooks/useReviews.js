import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProductReview, deleteReview, getProductReviews, updateReview } from "../api/reviews";
import { queryKeys } from "../api/queryKeys";
import toast from "react-hot-toast";
import { getApiError } from "../utils/errors";

export function useProductReviews(productId, params = { limit: 10, page: 1 }) {
  return useQuery({
    queryKey: queryKeys.reviews(productId, params),
    queryFn: () => getProductReviews(productId, params),
    enabled: Boolean(productId),
    staleTime: 30_000,
  });
}

export function useReviewMutations(productId) {
  const queryClient = useQueryClient();

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    queryClient.invalidateQueries({ queryKey: queryKeys.product(productId) });
  }

  const add = useMutation({
    mutationFn: (body) => addProductReview(productId, body),
    onSuccess: () => {
      toast.success("Review posted");
      refresh();
    },
    onError: (error) => toast.error(getApiError(error).message),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }) => updateReview(id, body),
    onSuccess: () => {
      toast.success("Review updated");
      refresh();
    },
    onError: (error) => toast.error(getApiError(error).message),
  });

  const remove = useMutation({
    mutationFn: (id) => deleteReview(id),
    onSuccess: () => {
      toast.success("Review deleted");
      refresh();
    },
    onError: (error) => toast.error(getApiError(error).message),
  });

  return { add, update, remove };
}