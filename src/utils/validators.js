import { z } from "zod";
import { isEgyptianPhone } from "./phone";

const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .regex(/\d/, "Include a number and a symbol.")
  .regex(/[^A-Za-z0-9]/, "Include a number and a symbol.");

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address"),
    phone: z.string().trim().min(1, "Enter your phone number").refine(isEgyptianPhone, "Enter a valid Egyptian mobile number"),
    password: passwordSchema,
    rePassword: z.string().min(1, "Re-enter your password"),
    terms: z.boolean().refine((value) => value, "Please agree to the Terms & Privacy Policy"),
  })
  .refine((values) => values.password === values.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export const emailSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address"),
});

export const resetCodeSchema = z.object({
  resetCode: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    rePassword: z.string().min(1, "Re-enter your password"),
  })
  .refine((values) => values.password === values.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export const reviewSchema = z.object({
  review: z.string().trim().min(3, "Write at least 3 characters").max(500, "Review is too long"),
  rating: z.coerce.number().min(1, "Pick a rating").max(5, "Pick a rating"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Enter your phone number").refine(isEgyptianPhone, "Enter a valid Egyptian mobile number"),
});

export const addressSchema = z.object({
  name: z.string().trim().min(2, "Give this address a label"),
  details: z.string().trim().min(5, "Enter street and building details"),
  phone: z.string().trim().min(1, "Enter a phone number").refine(isEgyptianPhone, "Enter a valid Egyptian mobile number"),
  city: z.string().trim().min(2, "Enter your city"),
});

export const shippingAddressSchema = z.object({
  details: z.string().trim().min(5, "Enter your street address and building details"),
  phone: z.string().trim().min(1, "Enter your phone number").refine(isEgyptianPhone, "Enter a valid Egyptian mobile number"),
  city: z.string().trim().min(2, "Enter your city"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password: passwordSchema,
    rePassword: z.string().min(1, "Re-enter your password"),
  })
  .refine((values) => values.password === values.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });
