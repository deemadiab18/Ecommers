import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddress, removeAddress } from "../api/addresses";
import { updateMe } from "../api/users";
import { queryKeys } from "../api/queryKeys";
import { useAuth } from "../context/AuthContext";
import { toEgyptianPhone } from "../utils/phone";
import toast from "react-hot-toast";
import { getApiError } from "../utils/errors";

export function useUpdateProfile() {
  const { user, patchUser } = useAuth();
  return useMutation({
    mutationFn: (values) => {
      const body = {
        name: values.name.trim(),
        phone: toEgyptianPhone(values.phone),
      };
      const nextEmail = values.email.trim().toLowerCase();
      if (nextEmail !== user?.email?.toLowerCase()) body.email = nextEmail;
      return updateMe(body);
    },
    onSuccess: (data, values) => {
      patchUser({
        name: data?.user?.name ?? values.name.trim(),
        email: data?.user?.email ?? values.email.trim().toLowerCase(),
        phone: toEgyptianPhone(values.phone),
      });
      toast.success("Profile updated");
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values) =>
      addAddress({
        name: values.name.trim(),
        details: values.details.trim(),
        phone: toEgyptianPhone(values.phone),
        city: values.city.trim(),
      }),
    onSuccess: (list) => {
      queryClient.setQueryData(queryKeys.addresses(), list);
      toast.success("Address saved");
    },
    onError: (error) => toast.error(getApiError(error).message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses() }),
  });
}

export function useRemoveAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => removeAddress(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.addresses() });
      const previous = queryClient.getQueryData(queryKeys.addresses());
      if (previous) {
        queryClient.setQueryData(
          queryKeys.addresses(),
          previous.filter((item) => item._id !== id),
        );
      }
      return { previous };
    },
    onSuccess: () => toast.success("Address removed"),
    onError: (error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.addresses(), context.previous);
      toast.error(getApiError(error).message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses() }),
  });
}