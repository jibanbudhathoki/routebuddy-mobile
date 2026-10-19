import { useState } from "react";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { securityService } from "../services/security.service";
import { useToast } from "../../../shared/components/ToastProvider";

export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await securityService.deleteAccount();
      queryClient.clear();
      showToast(
        response.message || "Your account has been deleted successfully.",
        {
          title: "Account Deleted",
          variant: "success",
        },
      );
      router.replace("/(auth)/login");
      return { success: true };
    } catch (err: any) {
      showToast(
        err?.message || "Failed to delete account. Please try again.",
        {
          title: "Error",
          variant: "error",
        },
      );
      return { success: false, error: err?.message };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAccount,
    isDeleting,
  };
}
