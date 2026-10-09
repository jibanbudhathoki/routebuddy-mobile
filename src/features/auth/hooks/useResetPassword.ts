import { useState } from 'react';

import { useToast } from '../../../shared/components/ToastProvider';
import { authService } from '../services/auth.service';
import { resetPasswordSchema } from '../validations/auth';

type ResetPasswordField = 'code' | 'password' | 'confirmPassword';

export function useResetPassword(email: string) {
  const { showToast } = useToast();
  const [errors, setErrors] = useState<Partial<Record<ResetPasswordField, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: ResetPasswordField) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function resetPassword(
    code: string,
    password: string,
    confirmPassword: string,
  ): Promise<boolean> {
    setErrors({});

    const validation = resetPasswordSchema.safeParse({
      code,
      password,
      confirmPassword,
    });
    if (!validation.success) {
      const fieldErrors: Partial<Record<ResetPasswordField, string>> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (
          (field === 'code' ||
            field === 'password' ||
            field === 'confirmPassword') &&
          !fieldErrors[field]
        ) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }

    if (isSubmitting) {
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.resetPassword({
        email,
        code,
        password,
        confirmPassword,
      });
      showToast(response.message, {
        durationMs: 4500,
        title: 'Password reset',
        variant: 'success',
      });
      return true;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Please try again.',
        {
          title: 'Could not reset password',
          variant: 'error',
        },
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    clearFieldError,
    errors,
    isSubmitting,
    resetPassword,
  };
}
