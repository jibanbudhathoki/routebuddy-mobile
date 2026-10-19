import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { securityService } from "../services/security.service";
import { useToast } from "../../../shared/components/ToastProvider";
import type {
  ChangePasswordInput,
  ChangeEmailInput,
  VerifyChangeEmailInput,
} from "../validations/security.schema";

export function useChangePassword() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const changePassword = async (data: ChangePasswordInput) => {
    setIsLoading(true);
    try {
      await securityService.changePassword(data);
      showToast("Your password has been changed successfully.", {
        title: "Password Updated",
        variant: "success",
      });
      router.back();
      return { success: true };
    } catch (err: any) {
      showToast(err?.message || "Failed to update password. Please try again.", {
        title: "Error",
        variant: "error",
      });
      return { success: false, error: err?.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
  };
}

export function useChangeEmail(onSuccess?: () => void) {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const requestEmailChange = async (data: ChangeEmailInput) => {
    setIsRequesting(true);
    try {
      const response = await securityService.requestEmailChange(data);
      setPendingEmail(data.email);
      setStep("verify");
      setCountdown(45);
      showToast(
        response.message || "Verification code sent to your new email address.",
        {
          title: "Code Sent",
          variant: "success",
        },
      );
      return { success: true };
    } catch (err: any) {
      showToast(
        err?.message || "Failed to request email change. Please try again.",
        {
          title: "Error",
          variant: "error",
        },
      );
      return { success: false, error: err?.message };
    } finally {
      setIsRequesting(false);
    }
  };

  const resendVerificationCode = async () => {
    if (countdown > 0 || !pendingEmail) return;
    return requestEmailChange({ email: pendingEmail });
  };

  const verifyEmailChange = async (data: VerifyChangeEmailInput) => {
    if (!pendingEmail) {
      showToast("Email address not found. Please re-enter your email.", {
        title: "Error",
        variant: "error",
      });
      setStep("request");
      return { success: false };
    }

    setIsVerifying(true);
    try {
      const response = await securityService.verifyEmailChange({
        email: pendingEmail,
        code: data.code,
      });
      showToast(response.message || "Your email was successfully changed.", {
        title: "Email Updated",
        variant: "success",
      });
      if (onSuccess) {
        onSuccess();
      }
      router.back();
      return { success: true };
    } catch (err: any) {
      showToast(
        err?.message || "Invalid or expired verification code.",
        {
          title: "Verification Failed",
          variant: "error",
        },
      );
      return { success: false, error: err?.message };
    } finally {
      setIsVerifying(false);
    }
  };

  const editEmail = () => {
    setStep("request");
  };

  return {
    step,
    pendingEmail,
    isRequesting,
    isVerifying,
    countdown,
    requestEmailChange,
    resendVerificationCode,
    verifyEmailChange,
    editEmail,
  };
}
