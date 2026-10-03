import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export interface TripCardData {
  store: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  earnings: string;
  itemCount: number;
  requesterCount: number;
  unreadMessages: number;
}

interface TripCardProps {
  trip: TripCardData;
}

export function TripCard({ trip }: TripCardProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.card}>
      <View style={styles.tripDetails}>
        <View
          style={[
            styles.storeMark,
            trip.store !== 'Walmart' && styles.otherStoreMark,
          ]}
        >
          <Text
            style={[
              styles.storeName,
              trip.store !== 'Walmart' && styles.otherStoreName,
            ]}
          >
            {trip.store}
          </Text>
          {trip.store === 'Walmart' && (
            <MaterialCommunityIcons
              name="asterisk"
              size={19}
              color={theme.colors.secondary}
            />
          )}
        </View>

        <View style={styles.routeDetails}>
          <Text style={styles.tripBadge}>DRIVING</Text>
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
              <Text style={styles.scheduleText}>{trip.date}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color={theme.colors.muted}
              />
              <Text style={styles.scheduleText}>{trip.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.earnings}>
          <Text style={styles.earningsLabel}>Earnings</Text>
          <Text style={styles.earningsAmount}>{trip.earnings}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={15}
            color={theme.colors.text}
          />
          <Text style={styles.metricText}>{trip.itemCount} Items</Text>
        </View>
        <View style={styles.metric}>
          <MaterialCommunityIcons
            name="account-multiple-outline"
            size={15}
            color={theme.colors.text}
          />
          <Text style={styles.metricText}>
            {trip.requesterCount} {trip.requesterCount === 1 ? 'Requester' : 'Requesters'}
          </Text>
        </View>
        <View style={styles.metric}>
          <MaterialCommunityIcons
            name="message-processing-outline"
            size={15}
            color={theme.colors.text}
          />
          <Text style={styles.metricText}>Messages</Text>
          <View style={styles.messageCount}>
            <Text style={styles.messageCountText}>{trip.unreadMessages}</Text>
          </View>
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
  tripDetails: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 72,
  },
  storeMark: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 7,
    height: 54,
    justifyContent: 'center',
    width: 48,
  },
  otherStoreMark: {
    backgroundColor: theme.colors.surface,
  },
  storeName: {
    color: theme.colors.onPrimary,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
  otherStoreName: {
    color: theme.colors.error,
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: '800',
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
  messageCount: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    height: 16,
    justifyContent: 'center',
    minWidth: 16,
    paddingHorizontal: 3,
  },
  messageCountText: {
    color: theme.colors.onPrimary,
    fontSize: 9,
    fontWeight: '700',
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
