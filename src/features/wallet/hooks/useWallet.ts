import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "../services/wallet.service";
import { useToast } from "../../../shared/components/ToastProvider";

const WALLET_BALANCE_KEY = ["walletBalance"];
const WALLET_ACTIVITIES_KEY = ["walletActivities"];
const WALLET_WITHDRAWALS_KEY = ["walletWithdrawals"];

export function useWallet() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const {
    data: balance = {
      totalBalance: 0,
      withdrawableBalance: 0,
      escrowBalance: 0,
    },
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: WALLET_BALANCE_KEY,
    queryFn: walletService.getBalance,
  });

  const {
    data: activities = [],
    isLoading: isLoadingActivities,
    refetch: refetchActivities,
  } = useQuery({
    queryKey: WALLET_ACTIVITIES_KEY,
    queryFn: walletService.getActivities,
  });

  const {
    data: withdrawalRequests = [],
    isLoading: isLoadingWithdrawals,
    refetch: refetchWithdrawals,
  } = useQuery({
    queryKey: WALLET_WITHDRAWALS_KEY,
    queryFn: walletService.getWithdrawalRequests,
  });

  const withdrawMutation = useMutation({
    mutationFn: ({ email, amount }: { email: string; amount: number }) =>
      walletService.requestWithdrawal(email, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY });
      queryClient.invalidateQueries({ queryKey: WALLET_ACTIVITIES_KEY });
      queryClient.invalidateQueries({ queryKey: WALLET_WITHDRAWALS_KEY });
    },
    onError: (err: any) => {
      showToast(err?.message || "Failed to process withdrawal request.", {
        title: "Withdrawal Failed",
        variant: "error",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: (email: string) => walletService.resendWithdrawalLink(email),
    onSuccess: (_data, email) => {
      showToast(`A new secure link has been sent to ${email}`, {
        title: "Link Resent",
        variant: "success",
      });
    },
    onError: (err: any) => {
      showToast(err?.message || "Unable to resend link. Please try again.", {
        title: "Error",
        variant: "error",
      });
    },
  });

  const withdraw = useCallback(
    (params: { email: string; amount: number } | string, amount?: number) => {
      if (typeof params === "string") {
        return withdrawMutation.mutateAsync({
          email: params,
          amount: amount ?? balance.withdrawableBalance,
        });
      }
      return withdrawMutation.mutateAsync(params);
    },
    [withdrawMutation, balance.withdrawableBalance],
  );

  return {
    balance,
    activities,
    withdrawalRequests,
    isLoading:
      isLoadingBalance || isLoadingActivities || isLoadingWithdrawals,
    refetch: () => {
      refetchBalance();
      refetchActivities();
      refetchWithdrawals();
    },
    withdraw,
    isWithdrawing: withdrawMutation.isPending,
    resendLink: resendMutation.mutateAsync,
    isResending: resendMutation.isPending,
  };
}
