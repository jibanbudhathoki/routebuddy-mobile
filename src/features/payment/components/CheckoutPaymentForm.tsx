import { CheckoutCardFields } from "./CheckoutCardFields";
import { CheckoutPaymentActions } from "./CheckoutPaymentActions";
import { CheckoutPaymentMethodSelector } from "./CheckoutPaymentMethodSelector";
import type { PaymentMethodItem } from "../types/paymentMethod.types";

interface CheckoutPaymentFormProps {
  nameOnCard: string;
  onChangeName: (name: string) => void;
  onCardValidityChange: (isValid: boolean) => void;
  isFormValid: boolean;
  hasFailed: boolean;
  isInitializing: boolean;
  total: number;
  onPay: () => void;
  onReset: () => void;
  savedMethods: PaymentMethodItem[];
  selectedMethodId: string | null;
  onSelectMethod: (id: string | null) => void;
  isLoadingMethods?: boolean;
}

export function CheckoutPaymentForm(props: CheckoutPaymentFormProps) {
  const isUsingSavedCard = props.selectedMethodId !== null;

  return (
    <>
      <CheckoutPaymentMethodSelector
        savedMethods={props.savedMethods}
        selectedMethodId={props.selectedMethodId}
        onSelectMethod={props.onSelectMethod}
        isLoading={props.isLoadingMethods}
      />

      {!isUsingSavedCard ? (
        <CheckoutCardFields
          nameOnCard={props.nameOnCard}
          onChangeName={props.onChangeName}
          onCardValidityChange={props.onCardValidityChange}
          isFormValid={props.isFormValid}
          hasFailed={props.hasFailed}
        />
      ) : null}

      <CheckoutPaymentActions
        hasFailed={props.hasFailed}
        isInitializing={props.isInitializing}
        total={props.total}
        onPay={props.onPay}
        onReset={props.onReset}
      />
    </>
  );
}
