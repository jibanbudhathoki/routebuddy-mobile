import { useState } from 'react';

import { useToast } from '../../../shared/components/ToastProvider';
import { authService } from '../services/auth.service';
import { forgotPasswordEmailSchema } from '../validations/auth';

export function useForgotPassword() {
  const { showToast } = useToast();
  const [emailError, setEmailError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFeedback() {
    setEmailError(undefined);
  }

  async function sendResetCode(email: string): Promise<string | undefined> {
    setEmailError(undefined);

    const normalizedEmail = email.trim().toLowerCase();
    const validationResult = forgotPasswordEmailSchema.safeParse(normalizedEmail);
    if (!validationResult.success) {
      setEmailError(validationResult.error.issues[0]?.message);
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.forgotPassword(normalizedEmail);
      showToast(response.message, {
        durationMs: 4500,
        title: 'Password reset code sent',
        variant: 'success',
      });
      return normalizedEmail;
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Please try again.',
        {
          title: 'Could not send reset code',
          variant: 'error',
        },
      );
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    clearFeedback,
    emailError,
    isSubmitting,
    sendResetCode,
  };
}
