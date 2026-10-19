export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | string;
  type: string;
  createdAt: string;
}

export interface CheckoutRequest {
  requestSlug: string;
  paymentMethodId?: string;
}

export interface CheckoutResponse {
  success?: boolean;
  message?: string;
  data: {
    clientSecret: string;
    captureBefore: string;
  };
}

export interface ConfirmDeliveryResponse {
  success?: boolean;
  message?: string;
  payoutAmount?: number;
  data?: {
    success: boolean;
    payoutAmount: number;
  };
}

export interface PaymentDetail {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
