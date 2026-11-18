import { useMutation } from "@tanstack/react-query";
import { signIn, signUp, forgotPassword, verifyResetCode, resetPassword } from "../api/auth";
import { changeMyPassword } from "../api/users";
import { useAuth } from "../context/AuthContext";
import { toEgyptianPhone } from "../utils/phone";
import { RESET_FLOW_KEY } from "../utils/storage";

export function useSignIn() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: ({ email, password }) =>
      signIn({ email: String(email).trim().toLowerCase(), password }),
    onSuccess: (data) => setSession(data),
  });
}

export function useSignUp() {
  const { setSession, patchUser } = useAuth();
  return useMutation({
    mutationFn: (values) => {
      const phone = toEgyptianPhone(values.phone);
      return signUp({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone,
        password: values.password,
        rePassword: values.rePassword,
      });
    },
    onSuccess: (data, variables) => {
      setSession(data);
      patchUser({ phone: toEgyptianPhone(variables.phone) });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ email }) => forgotPassword(email.trim().toLowerCase()),
    onSuccess: (_, variables) => {
      sessionStorage.setItem(RESET_FLOW_KEY, JSON.stringify({ email: variables.email.trim().toLowerCase(), step: 2 }));
    },
  });
}

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: ({ resetCode }) => verifyResetCode(resetCode),
    onSuccess: () => {
      try {
        const raw = sessionStorage.getItem(RESET_FLOW_KEY);
        if (!raw) return;
        const flow = JSON.parse(raw);
        sessionStorage.setItem(RESET_FLOW_KEY, JSON.stringify({ ...flow, step: 3, verified: true }));
      } catch {
        /* ignore */
      }
    },
  });
}

export function useResetPassword() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: ({ email, password }) =>
      resetPassword({ email: email.trim().toLowerCase(), newPassword: password }),
    onSuccess: (data) => {
      sessionStorage.removeItem(RESET_FLOW_KEY);
      if (data?.token) setSession(data);
    },
  });
}

export function useChangePassword() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: changeMyPassword,
    onSuccess: (data) => {
      if (data?.token) setSession(data);
    },
  });
}