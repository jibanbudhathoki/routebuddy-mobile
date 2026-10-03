import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { AppScreen } from '../../../shared/components/AppScreen';
import { TripCard } from '../components/TripCard';

const upcomingTrips = [
  {
    store: 'Walmart',
    origin: 'Reston, MB',
    destination: 'Brandon, MB',
    date: 'May 26, 2025',
    time: '6:00 PM',
    earnings: '$18.11',
    itemCount: 5,
    requesterCount: 1,
    unreadMessages: 2,
  },
  {
    store: 'Costco',
    origin: 'Reston, MB',
    destination: 'Winnipeg, MB',
    date: 'Jun 2, 2025',
    time: '10:30 AM',
    earnings: '$27.45',
    itemCount: 12,
    requesterCount: 2,
    unreadMessages: 1,
  },
  {
    store: 'Superstore',
    origin: 'Portage la Prairie, MB',
    destination: 'Morden, MB',
    date: 'Jun 5, 2025',
    time: '2:00 PM',
    earnings: '$14.20',
    itemCount: 7,
    requesterCount: 1,
    unreadMessages: 0,
  },
];

type TripMode = 'driving' | 'ordering';

export function TripScreen() {
  const [tripMode, setTripMode] = useState<TripMode>('driving');
  const { theme } = useUnistyles();

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

        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleGroup}>
            <MaterialCommunityIcons
              name={tripMode === 'driving' ? 'car' : 'bag-personal-outline'}
              size={20}
              color={theme.colors.text}
            />
            <Text style={styles.sectionTitle}>
              {tripMode === 'driving' ? 'Trips Coming Up' : 'Requests Coming Up'}
            </Text>
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

        {tripMode === 'driving' ? (
          <View style={styles.tripList}>
            {upcomingTrips.map((trip) => (
              <TripCard key={`${trip.store}-${trip.destination}`} trip={trip} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={30}
              color={theme.colors.muted}
            />
            <Text style={styles.emptyStateTitle}>No upcoming requests</Text>
            <Text style={styles.emptyStateText}>
              Requests you place will show up here.
            </Text>
          </View>
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
}));
