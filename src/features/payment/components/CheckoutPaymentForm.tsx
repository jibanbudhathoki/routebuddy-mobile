import { CheckoutCardFields } from "./CheckoutCardFields";
import { CheckoutPaymentActions } from "./CheckoutPaymentActions";
import { CheckoutPaymentMethodSelector } from "./CheckoutPaymentMethodSelector";

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
}

export function CheckoutPaymentForm(props: CheckoutPaymentFormProps) {
  return (
    <>
      <CheckoutPaymentMethodSelector />
      <CheckoutCardFields
        nameOnCard={props.nameOnCard}
        onChangeName={props.onChangeName}
        onCardValidityChange={props.onCardValidityChange}
        isFormValid={props.isFormValid}
        hasFailed={props.hasFailed}
      />
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
