export const PRICING_RATES = {
  SERVICE_FEE_RATE: 0.15,
  TAX_RATE: 0.05,
  PAYMENT_PROCESSING_RATE: 0.029,
  PAYMENT_PROCESSING_FIXED: 0.30,
};

export interface PricingEstimate {
  subtotal: number;
  serviceFee: number;
  taxes: number;
  paymentProcessing: number;
  total: number;
}

export function calculateEstimate(items: Array<{ estimatedPrice: string | number }>): PricingEstimate {
  const subtotal = items.reduce((sum, item) => {
    const price = typeof item.estimatedPrice === "string" ? parseFloat(item.estimatedPrice) : item.estimatedPrice;
    return sum + (price || 0);
  }, 0);

  const serviceFee = subtotal * PRICING_RATES.SERVICE_FEE_RATE;
  const taxes = subtotal * PRICING_RATES.TAX_RATE;
  const paymentProcessing = items.length > 0 ? (subtotal * PRICING_RATES.PAYMENT_PROCESSING_RATE) + PRICING_RATES.PAYMENT_PROCESSING_FIXED : 0;
  
  const total = items.length > 0 ? subtotal + serviceFee + taxes + paymentProcessing : 0;

  return {
    subtotal,
    serviceFee,
    taxes,
    paymentProcessing,
    total,
  };
}
