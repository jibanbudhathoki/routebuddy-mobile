import { useState } from 'react';

import { useToast } from '../../../shared/components/ToastProvider';
import { authService } from '../services/auth.service';

export function useVerifyEmail(email: string) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function verifyEmail(code: string): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.verifyEmail({ email, code });
      showToast(response.message, {
        durationMs: 4500,
        title: 'Email verified',
        variant: 'success',
      });
      return true;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Please try again.',
        {
          title: 'Could not verify email',
          variant: 'error',
        },
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, verifyEmail };
}
