import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { AppScreen } from '../../../shared/components/AppScreen';
import { NotificationBellButton } from '../../../shared/components/NotificationBellButton';
import { useUnreadNotificationCount } from '../../notifications/hooks/useNotifications';
import { MyRequestsScreen } from '../../request/screens/MyRequestsScreen';
import { AssignedToMeOrders } from '../components/AssignedToMeOrders';
import {
  RequestOrderModeDropdown,
  type RequestOrderMode,
} from '../components/RequestOrderModeDropdown';
import { TripCard } from '../components/TripCard';
import { useListMyTrip } from '../hooks/listMyTrip';
import { styles } from './tripScreen.styles';

type TripMode = 'driving' | 'ordering';

export function TripScreen() {
  const router = useRouter();
  const [tripMode, setTripMode] = useState<TripMode>('driving');
  const [requestOrderMode, setRequestOrderMode] =
    useState<RequestOrderMode>('posted');
  const { theme } = useUnistyles();
  const unreadCount = useUnreadNotificationCount();
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
          <NotificationBellButton
            unreadCount={unreadCount}
            onPress={() => router.push('/notifications')}
          />
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
          <>
            <RequestOrderModeDropdown
              value={requestOrderMode}
              onChange={setRequestOrderMode}
            />
            {requestOrderMode === 'posted' ? (
              <MyRequestsScreen />
            ) : (
              <AssignedToMeOrders />
            )}
          </>
        )}
      </ScrollView>
    </AppScreen>
  );
}
