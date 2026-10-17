import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import {
  WalletBalance,
  WalletActivity,
  WithdrawalResult,
  ApiWalletSummary,
  ApiWalletActivity,
  ApiWithdrawalResponse,
  mapApiWalletSummary,
  mapApiWalletActivity,
} from "../types/wallet.types";

export const walletService = {
  getBalance: async (): Promise<WalletBalance> => {
    const response = await apiRequest<any>(
      apiEndpoints.payments.walletSummary,
      {
        method: "GET",
      },
    );

    const summary: ApiWalletSummary = response?.data ?? response ?? {
      balance: 0,
      pendingEscrow: 0,
    };

    return mapApiWalletSummary(summary);
  },

  getActivities: async (): Promise<WalletActivity[]> => {
    const response = await apiRequest<any>(
      apiEndpoints.payments.walletActivity,
      {
        method: "GET",
      },
    );

    const list: ApiWalletActivity[] = Array.isArray(response)
      ? response
      : response?.data && Array.isArray(response.data)
      ? response.data
      : [];

    return list.map(mapApiWalletActivity);
  },

  requestWithdrawal: async (
    email: string,
    amount: number,
  ): Promise<WithdrawalResult> => {
    const response = await apiRequest<ApiWithdrawalResponse>(
      apiEndpoints.payments.withdraw,
      {
        method: "POST",
        body: {
          amount,
          destinationEmail: email,
        },
      },
    );

    // Generate security answer for recipient e-transfer authentication
    const securityAnswer = Math.floor(10000000 + Math.random() * 90000000).toString();

    return {
      email,
      amount: response?.amount ?? amount,
      securityAnswer,
      timestamp: new Date().toISOString(),
    };
  },

  resendWithdrawalLink: async (_email: string): Promise<boolean> => {
    return true;
  },

  getWithdrawalRequests: async (): Promise<
    Array<{
      id: string;
      amount: number;
      status: string;
      destinationEmail: string;
      createdAt: string;
    }>
  > => {
    const response = await apiRequest<any>(apiEndpoints.payments.withdraw, {
      method: "GET",
    });

    if (Array.isArray(response)) {
      return response;
    }
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },
};
