import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { SharedDetailLayout } from "../../../shared/components/SharedDetailLayout";
import { RequestAssignedDriver } from "../components/RequestAssignedDriver";
import { RequestDetailsOverview } from "../components/RequestDetailsOverview";
import { RequestDetailsSummary } from "../components/RequestDetailsSummary";
import { RequestShoppingList } from "../components/RequestShoppingList";
import { RequestStatusTimeline } from "../components/RequestStatusTimeline";
import { useSharedRequestDetails } from "../hooks/useSharedRequestDetails";

export function SharedRequestScreen() {
  const router = useRouter();
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const requestUid = typeof uid === "string" ? uid : "";
  const { data: request, error, isLoading, refetch } =
    useSharedRequestDetails(requestUid);

  return (
    <SharedDetailLayout
      title="Shared Request"
      isLoading={isLoading}
      errorMessage={
        error?.message ??
        (!request && !isLoading
          ? requestUid
            ? "Request details are unavailable."
            : "Request ID is missing."
          : undefined)
      }
      onBack={() => router.back()}
      onRetry={requestUid ? () => void refetch() : undefined}
    >
      {request ? (
        <View style={styles.content}>
          <RequestDetailsOverview request={request} />
          {request.driver ? <RequestAssignedDriver driver={request.driver} /> : null}
          <RequestStatusTimeline request={request} />
          <RequestShoppingList request={request} />
          <RequestDetailsSummary request={request} />
        </View>
      ) : null}
    </SharedDetailLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing.sm,
  },
}));
