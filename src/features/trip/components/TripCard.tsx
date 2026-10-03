import { Image, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { ListMyTripsResponse } from '../types/trip';

interface TripCardProps {
  trip: ListMyTripsResponse;
}

export function TripCard({ trip }: TripCardProps) {
  const { theme } = useUnistyles();
  const departure = new Date(trip.departureAt);
  const date = departure.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = departure.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  const price = trip.price.startsWith('$') ? trip.price : `$${trip.price}`;
  const status = trip.status.replace(/[_-]+/g, ' ').toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.tripDetails}>
        {trip.driver.photoUrl ? (
          <Image
            source={{ uri: trip.driver.photoUrl }}
            style={styles.driverPhoto}
            accessibilityLabel={`${trip.driver.name}'s profile photo`}
          />
        ) : (
          <View style={styles.driverPhotoFallback}>
            <Text style={styles.driverInitials}>
              {trip.driver.name
                .split(/\s+/)
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.routeDetails}>
          <View style={styles.tripHeading}>
            <Text style={styles.tripBadge}>{status}</Text>
            <Text style={styles.driverName} numberOfLines={1}>
              {trip.driver.name}
            </Text>
          </View>
          <View style={styles.route}>
            <Text style={styles.location} numberOfLines={1}>
              {trip.origin}
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={17}
              color={theme.colors.text}
            />
            <Text style={styles.location} numberOfLines={1}>
              {trip.destination}
            </Text>
          </View>
          <View style={styles.schedule}>
            <View style={styles.scheduleItem}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={14}
                color={theme.colors.muted}
              />
              <Text style={styles.scheduleText}>{date}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color={theme.colors.muted}
              />
              <Text style={styles.scheduleText}>{time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.earnings}>
          <Text style={styles.earningsLabel}>Price</Text>
          <Text style={styles.earningsAmount}>{price}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <MaterialCommunityIcons
            name="seat-outline"
            size={15}
            color={theme.colors.text}
          />
          <Text style={styles.metricText}>{trip.availableSeats} Available</Text>
        </View>
        <View style={styles.metric}>
          <MaterialCommunityIcons
            name="account-multiple-outline"
            size={15}
            color={theme.colors.text}
          />
          <Text style={styles.metricText}>
            {trip.capacity - trip.availableSeats} Booked
          </Text>
        </View>
        <View style={styles.metric}>
          <MaterialCommunityIcons
            name="seatbelt"
            size={15}
            color={theme.colors.text}
          />
          <Text style={styles.metricText}>{trip.capacity} Capacity</Text>
        </View>
      </View>

      <View style={styles.detailsButton}>
        <Text style={styles.detailsLabel}>View Trip Details</Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={17}
          color={theme.colors.text}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    elevation: 2,
    overflow: 'hidden',
    padding: theme.spacing.sm,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  driverPhoto: {
    borderRadius: 7,
    height: 54,
    resizeMode: 'cover',
    width: 48,
  },
  driverPhotoFallback: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 7,
    height: 54,
    justifyContent: 'center',
    width: 48,
  },
  driverInitials: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  tripDetails: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 72,
  },
  tripHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  driverName: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
  },
  routeDetails: {
    flex: 1,
    gap: 4,
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
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  route: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  location: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  schedule: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  scheduleItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  scheduleText: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  earnings: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingLeft: theme.spacing.xs,
  },
  earningsLabel: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  earningsAmount: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  metrics: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  metric: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metricText: {
    color: theme.colors.text,
    fontSize: 9,
  },
  detailsButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 6,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    justifyContent: 'center',
    minHeight: 34,
  },
  detailsLabel: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: '500',
  },
}));
