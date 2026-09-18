import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '../../../shared/components/Button';
import { WelcomeHero } from '../components/WelcomeHero';

type WelcomeScreenProps = {
  onGetStarted: () => void;
  onLogIn: () => void;
};

const benefits: Array<{
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
}> = [
  { icon: 'cart-outline', title: 'GROCERY &\nESSENTIALS\nDELIVERY' },
  { icon: 'map-marker-outline', title: 'RURAL COMMUNITIES\nWE KNOW &\nWE CARE' },
  { icon: 'account-group-outline', title: 'LOCAL DRIVERS.\nREAL PEOPLE.\nYOU CAN TRUST.' },
  { icon: 'heart-outline', title: 'SUPPORTING OUR\nNEIGHBOURS,\nTOGETHER.' },
];

export function WelcomeScreen({ onGetStarted, onLogIn }: WelcomeScreenProps) {
  return (
    <View style={styles.screen}>
      <WelcomeHero />

      <View style={styles.bottomSection}>
        <View style={styles.benefits}>
          {benefits.map((benefit, index) => (
            <View key={benefit.title} style={[styles.benefit, index > 0 && styles.divider]}>
              <View style={styles.benefitIcon}>
                <MaterialCommunityIcons name={benefit.icon} size={25} color={styles.icon.color} />
              </View>
              <Text style={styles.benefitText}>{benefit.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Get Started" onPress={onGetStarted} style={styles.primaryButton} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log in to your account"
            onPress={onLogIn}
            style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons name="account-outline" size={28} color={styles.loginIcon.color} />
            <Text style={styles.loginLabel}>Log In to Your Account</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    backgroundColor: theme.colors.surface,
    flex: 1,
  },
  bottomSection: {
    backgroundColor: theme.colors.primary,
  },
  benefits: {
    flexDirection: 'row',
    flexShrink: 0,
    paddingHorizontal: theme.spacing.xs,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl + 24,
  },
  benefit: {
    alignItems: 'center',
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 2,
  },
  divider: {
    borderLeftColor: theme.colors.primarySoft,
    borderLeftWidth: 1,
  },
  benefitIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryRaised,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
    width: 48,
  },
  icon: {
    color: theme.colors.onPrimary,
  },
  benefitText: {
    color: theme.colors.onPrimary,
    fontSize: 8,
    fontWeight: '600',
    lineHeight: 12,
    textAlign: 'center',
  },
  actions: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flexShrink: 0,
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl + 16,
    marginTop: -32,
  },
  loginButton: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButton: {
    minHeight: 56,
  },
  pressed: {
    backgroundColor: theme.colors.primarySoft,
  },
  loginIcon: {
    color: theme.colors.primary,
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  loginLabel: {
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
}));
