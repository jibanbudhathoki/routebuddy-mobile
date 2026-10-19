export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';

export interface PaymentMethodItem {
  id: string;
  brand: CardBrand;
  brandDisplayName: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  holderName?: string;
}

export interface ApiPaymentMethodCard {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface ApiPaymentMethod {
  id: string;
  type: string;
  card?: ApiPaymentMethodCard;
  isDefault: boolean;
}

export interface SetupIntentResponse {
  clientSecret: string;
  setupIntentId: string;
  publishableKey?: string;
  stripePublishableKey?: string;
}

export interface AddPaymentMethodInput {
  holderName: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc?: string;
  postalCode?: string;
}

export function mapApiPaymentMethod(apiItem: any): PaymentMethodItem {
  const rawBrand = (apiItem.card?.brand || apiItem.brand || '').toLowerCase();
  let brand: CardBrand = 'other';
  if (rawBrand.includes('visa')) brand = 'visa';
  else if (rawBrand.includes('mastercard')) brand = 'mastercard';
  else if (rawBrand.includes('amex') || rawBrand.includes('american express')) brand = 'amex';
  else if (rawBrand.includes('discover')) brand = 'discover';

  const brandDisplayMap: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    other: 'Card',
  };

  const expMonth = apiItem.card?.expMonth ?? apiItem.expMonth;
  const expYear = apiItem.card?.expYear ?? apiItem.expYear;
  const last4 = apiItem.card?.last4 ?? apiItem.last4 ?? '••••';

  const expMonthStr = expMonth
    ? String(expMonth).padStart(2, '0')
    : '00';
  const expYearStr = expYear
    ? String(expYear).slice(-2)
    : '00';

  return {
    id: apiItem.id,
    brand,
    brandDisplayName: brandDisplayMap[brand] || 'Card',
    last4,
    expiryMonth: expMonthStr,
    expiryYear: expYearStr,
    isDefault: !!apiItem.isDefault,
  };
}
