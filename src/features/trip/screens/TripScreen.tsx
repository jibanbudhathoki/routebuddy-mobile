import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { AppScreen } from '../../../shared/components/AppScreen';
import { MyRequestsScreen } from '../../request/screens/MyRequestsScreen';
import { TripCard } from '../components/TripCard';
import { useListMyTrip } from '../hooks/listMyTrip';

type TripMode = 'driving' | 'ordering';

export function TripScreen() {
  const [tripMode, setTripMode] = useState<TripMode>('driving');
  const { theme } = useUnistyles();
  const {
    data: trips,
    error,
    isLoading,
    refetch,
  } = useListMyTrip(tripMode === 'driving');

  return (
    <AppScreen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Trips</Text>
          <View style={styles.notification}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={23}
              color={theme.colors.text}
            />
            <View style={styles.notificationCount}>
              <Text style={styles.notificationCountText}>3</Text>
            </View>
          </View>
        </View>

        <View style={styles.segmentControl}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tripMode === 'driving' }}
            onPress={() => setTripMode('driving')}
            style={[
              styles.segment,
              tripMode === 'driving' && styles.activeSegment,
            ]}
          >
            <MaterialCommunityIcons
              name="car"
              size={18}
              color={tripMode === 'driving' ? theme.colors.onPrimary : theme.colors.text}
            />
            <Text
              style={[
                styles.segmentLabel,
                tripMode === 'driving' && styles.activeSegmentLabel,
              ]}
            >
              Trips (Driving)
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tripMode === 'ordering' }}
            onPress={() => setTripMode('ordering')}
            style={[
              styles.segment,
              tripMode === 'ordering' && styles.activeSegment,
            ]}
          >
            <MaterialCommunityIcons
              name="bag-personal-outline"
              size={18}
              color={tripMode === 'ordering' ? theme.colors.onPrimary : theme.colors.text}
            />
            <Text
              style={[
                styles.segmentLabel,
                tripMode === 'ordering' && styles.activeSegmentLabel,
              ]}
            >
              Requests (Ordering)
            </Text>
          </Pressable>
        </View>

        {tripMode === 'driving' ? (
          <>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionTitleGroup}>
                <MaterialCommunityIcons
                  name="car"
                  size={20}
                  color={theme.colors.text}
                />
                <Text style={styles.sectionTitle}>Trips Coming Up</Text>
              </View>
              <View style={styles.viewAll}>
                <Text style={styles.viewAllText}>View All</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={theme.colors.text}
                />
              </View>
            </View>
            {isLoading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Loading your trips...</Text>
              </View>
            ) : error ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>Could not load trips</Text>
                <Text style={styles.emptyStateText}>
                  {error.message || 'Please try again.'}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => refetch()}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
              </View>
            ) : trips?.length ? (
              <View style={styles.tripList}>
                {trips.map((trip) => (
                  <TripCard key={trip.uid} trip={trip} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={30}
                  color={theme.colors.muted}
                />
                <Text style={styles.emptyStateTitle}>No upcoming trips</Text>
                <Text style={styles.emptyStateText}>
                  Trips you post will show up here.
                </Text>
              </View>
            )}
          </>
        ) : (
          <MyRequestsScreen />
        )}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 25,
    fontWeight: '700',
  },
  notification: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xs,
  },
  notificationCount: {
    alignItems: 'center',
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: 16,
  },
  notificationCountText: {
    color: theme.colors.onPrimary,
    fontSize: 9,
    fontWeight: '700',
  },
  segmentControl: {
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  segment: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: theme.spacing.xs,
  },
  activeSegment: {
    backgroundColor: theme.colors.primary,
  },
  segmentLabel: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  activeSegmentLabel: {
    color: theme.colors.onPrimary,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionTitleGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  viewAll: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  viewAllText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  tripList: {
    gap: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  emptyStateTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyStateText: {
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
