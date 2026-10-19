import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

export const verifyChangeEmailSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must only contain digits"),
});

export type VerifyChangeEmailInput = z.infer<typeof verifyChangeEmailSchema>;
