import { PaymentSuccessHeader } from "./PaymentSuccessHeader";
import { PaymentSuccessNextSteps } from "./PaymentSuccessNextSteps";
import { PaymentSuccessOrderSummary } from "./PaymentSuccessOrderSummary";

interface PaymentSuccessDetailsProps {
  isRequestPublished?: boolean;
  storeName: string;
  storeLogoText: string;
  storeLogoSubText: string;
  routeText: string;
  neededBy?: string;
  latestDeliveryTime?: string;
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
  showEstimatedBreakdown?: boolean;
  conversationError: string;
  isCreatingConversation: boolean;
  onRetryConversation: () => void;
  onGoHome: () => void;
  onViewDetails: () => void;
}

export function PaymentSuccessDetails(props: PaymentSuccessDetailsProps) {
  return (
    <>
      <PaymentSuccessHeader
        total={props.total}
        isRequestPublished={props.isRequestPublished}
        conversationError={props.conversationError}
        isCreatingConversation={props.isCreatingConversation}
        onRetryConversation={props.onRetryConversation}
      />
      <PaymentSuccessOrderSummary
        isRequestPublished={props.isRequestPublished}
        storeName={props.storeName}
        storeLogoText={props.storeLogoText}
        storeLogoSubText={props.storeLogoSubText}
        routeText={props.routeText}
        neededBy={props.neededBy}
        latestDeliveryTime={props.latestDeliveryTime}
        itemCount={props.itemCount}
        subtotal={props.subtotal}
        serviceFee={props.serviceFee}
        taxes={props.taxes}
        total={props.total}
        showEstimatedBreakdown={props.showEstimatedBreakdown}
      />
      <PaymentSuccessNextSteps
        isRequestPublished={props.isRequestPublished}
        onGoHome={props.onGoHome}
        onViewDetails={props.onViewDetails}
      />
    </>
  );
}
