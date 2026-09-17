import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '../../../shared/components/Button';
import { AppScreen } from '../../../shared/components/AppScreen';

export function HomeScreen() {
  return (
    <AppScreen>
      <Text style={styles.eyebrow}>ROUTEBUDDY</Text>
      <Text style={styles.title}>Plan the journey, enjoy the route.</Text>
      <Text style={styles.description}>
        Your mobile companion for discovering memorable places and building
        better trips.
      </Text>
      <View style={styles.routeCard}>
        <Text style={styles.cardLabel}>NEXT ADVENTURE</Text>
        <Text style={styles.cardTitle}>Ready when you are</Text>
        <Text style={styles.cardDescription}>
          Unistyles is configured with adaptive light and dark themes.
        </Text>
        <Button
          title="Continue"
          onPress={() => undefined}
          style={styles.continueButton}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    maxWidth: 360,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: theme.spacing.md,
    maxWidth: 340,
  },
  routeCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
  },
  cardLabel: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: theme.spacing.sm,
  },
  cardDescription: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: theme.spacing.sm,
  },
  continueButton: {
    marginTop: theme.spacing.lg,
  },
}));