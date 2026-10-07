import { Image, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { AppScreen } from '../../../shared/components/AppScreen';
import { Button } from '../../../shared/components/Button';
import { useToast } from '../../../shared/components/ToastProvider';
import { DeleteTripConfirmationModal } from '../components/DeleteTripConfirmationModal';
import { TripOptionsSheet, type TripOptionAction } from '../components/TripOptionsSheet';
import { useDeleteTrip } from '../hooks/useDeleteTrip';
import { useTripDetails } from '../hooks/useTripDetails';

export function TripDetailsScreen() {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const tripUid = typeof uid === 'string' ? uid : '';
  const deleteTripMutation = useDeleteTrip();
  const { data: trip, error, isLoading, refetch } = useTripDetails(tripUid);
  const status = trip?.status.toLowerCase().replace(/[_-]+/g, ' ') ?? '';
  const timelineProgress =
    status === 'completed' ? 3 : status === 'delivering' ? 2 : status === 'shopping' ? 1 : 0;
  const departureDate = trip ? formatDate(trip.departureAt) : '';
  const deliveryDate = trip ? formatDate(trip.deliveryLatestBy) : '';
  const deliveryTime = trip ? formatTime(trip.deliveryLatestBy) : '';
  const tripPrice = trip?.price ?? '-';

  return (
    <AppScreen>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.headerAction}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              color={theme.colors.text}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Trip Details</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trip options"
            accessibilityState={{ disabled: !trip }}
            disabled={!trip}
            onPress={() => setShowOptions(true)}
            style={styles.headerAction}
          >
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={22}
              color={theme.colors.text}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>Loading trip details...</Text>
            </View>
          ) : error || !trip ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>Could not load trip details</Text>
              <Text style={styles.stateText}>
                {error?.message ?? (tripUid ? 'Trip details are unavailable.' : 'Trip ID is missing.')}
              </Text>
              {tripUid && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => refetch()}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <>
          <View style={styles.overview}>
            <View style={styles.overviewMain}>
              <Text style={styles.tripBadge}>{status.toUpperCase()}</Text>
              <View style={styles.route}>
                <Text style={styles.routeText}>{trip.origin}</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={17}
                  color={theme.colors.text}
                />
                <Text style={styles.routeText}>{trip.destination}</Text>
              </View>
              <View style={styles.departureInfo}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={14}
                  color={theme.colors.text}
                />
                <Text style={styles.departureText}>{departureDate}</Text>
                <View style={styles.metaDivider} />
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color={theme.colors.text}
                />
                <Text style={styles.departureText}>
                  Deliver by {deliveryDate} {deliveryTime}
                </Text>
              </View>
            </View>
            <View style={styles.earnings}>
              <Text style={styles.mutedLabel}>Trip Price</Text>
              <Text style={styles.earningsValue}>{tripPrice}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.timeline}>
              <TimelineStep label="Accepted" time={formatTime(trip.createdAt)} complete />
              <TimelineStep label="Shopping" time="--" complete={timelineProgress >= 1} />
              <TimelineStep label="Delivering" time="--" complete={timelineProgress >= 2} />
              <TimelineStep label="Completed" time="--" complete={timelineProgress >= 3} last />
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle title={`Stores (${trip.stores.length})`} />
            <View style={styles.card}>
              {trip.stores.map((store, index) => (
                <StoreRow
                  key={store.uid}
                  name={store.name}
                  location={`${store.location.city.name}, ${store.location.province.name}`}
                  showDivider={index < trip.stores.length - 1}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle title="Route Overview" />
            <View style={[styles.card, styles.routeCard]}>
              <View style={styles.routeStops}>
                <RouteStop label="Pickup" location={trip.origin} />
                <RouteStop label="Delivery" location={trip.destination} />
              </View>
              <View style={styles.mapButton}>
                <MaterialCommunityIcons
                  name="navigation-variant"
                  size={15}
                  color={theme.colors.text}
                />
                <Text style={styles.mapButtonText}>View on Map</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle title="Driver" />
            <View style={styles.customerRow}>
              {trip.driver.photoUrl ? (
                <Image
                  source={{ uri: trip.driver.photoUrl }}
                  style={styles.avatarImage}
                  accessibilityLabel={`${trip.driver.name}'s profile photo`}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(trip.driver.name)}
                  </Text>
                </View>
              )}
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{trip.driver.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle title="Delivery Instructions" />
            <View style={[styles.card, styles.instructions]}>
              <MaterialCommunityIcons
                name="message-outline"
                size={15}
                color={theme.colors.muted}
              />
              <Text style={styles.instructionsText}>
                {trip.notes || 'No delivery instructions were provided.'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle title="Trip Details" />
            <View style={[styles.card, styles.tripMetrics]}>
              <DetailMetric icon="store-outline" label="Stores" value={String(trip.stores.length)} />
              <DetailMetric icon="seat-outline" label="Available" value={String(trip.availableSeats)} />
              <DetailMetric icon="seatbelt" label="Capacity" value={String(trip.capacity)} />
              <MaterialCommunityIcons
                name="chevron-right"
                size={17}
                color={theme.colors.text}
              />
            </View>
          </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Start Shopping"
            onPress={() => {}}
            style={styles.startButton}
          />
          <View style={styles.buttonIcon}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={18}
              color={theme.colors.onPrimary}
            />
          </View>
        </View>
      </View>
      <TripOptionsSheet
        visible={showOptions}
        acceptsNewOrders={trip?.status.toLowerCase() === 'open'}
        onClose={() => setShowOptions(false)}
        onSelect={(action) => handleTripOption(action)}
      />
      <DeleteTripConfirmationModal
        visible={showDeleteConfirmation}
        isDeleting={deleteTripMutation.isPending}
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDeleteTrip}
      />
    </AppScreen>
  );

  async function handleTripOption(action: TripOptionAction) {
    setShowOptions(false);
    if (!trip) return;

    if (action === 'share') {
      try {
        await Share.share({
          message: `Trip: ${trip.origin} to ${trip.destination}, departing ${formatDate(trip.departureAt)}.`,
        });
      } catch {
        showToast('Unable to share this trip.');
      }
      return;
    }

    if (action === 'delete') {
      setShowDeleteConfirmation(true);
      return;
    }

    const messages: Record<
      Exclude<TripOptionAction, 'share' | 'delete'>,
      string
    > = {
      edit: 'Editing trips is not available yet.',
      'close-orders': 'Trip order settings are not saved yet.',
      cancel: 'Trip cancellation is not available yet.',
    };
    showToast(messages[action]);
  }

  function confirmDeleteTrip() {
    if (!tripUid || deleteTripMutation.isPending) return;

    deleteTripMutation.mutate(tripUid, {
      onSuccess: (response) => {
        setShowDeleteConfirmation(false);
        showToast(response.message || 'Trip deleted successfully.');
        router.back();
      },
      onError: (deleteError) => {
        setShowDeleteConfirmation(false);
        showToast(
          deleteError instanceof Error
            ? deleteError.message
            : 'Failed to delete trip.',
        );
      },
    });
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function TimelineStep({
  label,
  time,
  complete = false,
  last = false,
}: {
  label: string;
  time: string;
  complete?: boolean;
  last?: boolean;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.timelineStep}>
      <View style={styles.timelineMarkerRow}>
        {complete ? (
          <View style={styles.completeMarker}>
            <MaterialCommunityIcons
              name="check"
              size={10}
              color={theme.colors.onPrimary}
            />
          </View>
        ) : (
          <View style={styles.pendingMarker} />
        )}
        {!last && (
          <View
            style={[
              styles.timelineLine,
              complete && styles.timelineLineComplete,
            ]}
          />
        )}
      </View>
      <Text style={styles.timelineLabel}>{label}</Text>
      <Text style={styles.timelineTime}>{time}</Text>
    </View>
  );
}

function StoreRow({
  name,
  location,
  showDivider,
}: {
  name: string;
  location: string;
  showDivider: boolean;
}) {
  const initials = getInitials(name);

  return (
    <View style={[styles.storeRow, showDivider && styles.storeRowDivider]}>
      <View style={styles.storeLogo}>
        <Text style={styles.storeLogoText}>{initials}</Text>
      </View>
      <View style={styles.storeInfo}>
        <Text style={styles.storeName} numberOfLines={1}>{name}</Text>
        <Text style={styles.storeItems} numberOfLines={1}>{location}</Text>
      </View>
    </View>
  );
}

function RouteStop({ label, location }: { label: string; location: string }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.routeStop}>
      <MaterialCommunityIcons
        name="map-marker"
        size={17}
        color={theme.colors.primary}
      />
      <View>
        <Text style={styles.stopLabel}>{label}</Text>
        <Text style={styles.stopLocation}>{location}</Text>
      </View>
    </View>
  );
}

function DetailMetric({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.detailMetric}>
      <View style={styles.metricLabel}>
        <MaterialCommunityIcons
          name={icon}
          size={14}
          color={theme.colors.text}
        />
        <Text style={styles.metricTitle}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 42,
    justifyContent: 'space-between',
  },
  headerAction: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  overview: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.xs,
  },
  overviewMain: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  tripBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    color: theme.colors.onPrimary,
    fontSize: 9,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  route: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  routeText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  departureInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  departureText: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  metaDivider: {
    backgroundColor: theme.colors.border,
    height: 12,
    marginHorizontal: 3,
    width: 1,
  },
  earnings: {
    alignItems: 'flex-end',
    gap: 3,
    paddingLeft: theme.spacing.xs,
  },
  mutedLabel: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  earningsValue: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.sm,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.sm,
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
  },
  timelineMarkerRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 18,
  },
  completeMarker: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    height: 16,
    justifyContent: 'center',
    width: 16,
    zIndex: 1,
  },
  pendingMarker: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.muted,
    borderRadius: 7,
    borderWidth: 1,
    height: 14,
    width: 14,
    zIndex: 1,
  },
  timelineLine: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 1,
    marginLeft: -1,
  },
  timelineLineComplete: {
    backgroundColor: theme.colors.primary,
  },
  timelineLabel: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  timelineTime: {
    color: theme.colors.muted,
    fontSize: 8,
    marginBottom: theme.spacing.sm,
    marginTop: 2,
  },
  section: {
    gap: 5,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  storeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 52,
  },
  storeRowDivider: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  storeLogo: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  storeLogoText: {
    color: theme.colors.onPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  storeInfo: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  storeName: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: '600',
  },
  storeItems: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  routeCard: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 78,
    paddingVertical: theme.spacing.sm,
  },
  routeStops: {
    gap: theme.spacing.sm,
  },
  routeStop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  stopLabel: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: '600',
  },
  stopLocation: {
    color: theme.colors.muted,
    fontSize: 9,
    marginTop: 2,
  },
  mapButton: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  mapButtonText: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: '500',
  },
  customerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  avatarImage: {
    borderRadius: 21,
    height: 42,
    width: 42,
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  customerInfo: {
    flex: 1,
    gap: 3,
  },
  customerName: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  instructions: {
    alignItems: 'flex-start',
    backgroundColor: theme.colors.background,
    borderWidth: 0,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  instructionsText: {
    color: theme.colors.muted,
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },
  tripMetrics: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: theme.spacing.xs,
  },
  detailMetric: {
    gap: 3,
  },
  metricLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metricTitle: {
    color: theme.colors.muted,
    fontSize: 8,
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: '600',
    paddingLeft: 18,
  },
  footer: {
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
  },
  startButton: {
    minHeight: 48,
  },
  buttonIcon: {
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    height: 48,
    justifyContent: 'center',
    paddingLeft: theme.spacing.lg,
  },
  stateCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  stateTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
}));