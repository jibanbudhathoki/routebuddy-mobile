import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '../../../shared/components/Button';

type WelcomeScreenProps = {
  onGetStarted: () => void;
  onLogIn: () => void;
};

const benefits = [
  { icon: '▱', title: 'GROCERY &\nESSENTIALS\nDELIVERY' },
  { icon: '●', title: 'RURAL COMMUNITIES\nWE KNOW &\nWE CARE' },
  { icon: '●●●', title: 'LOCAL DRIVERS.\nREAL PEOPLE.\nYOU CAN TRUST.' },
  { icon: '♥', title: 'SUPPORTING OUR\nNEIGHBOURS,\nTOGETHER.' },
];

export function WelcomeScreen({ onGetStarted, onLogIn }: WelcomeScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.skyGlow} />
        <View style={styles.brandMark}>
          <Text style={styles.logo}>RB</Text>
        </View>
        <Text style={styles.brandName}>Route Buddy</Text>
        <View style={styles.taglineRow}>
          <View style={styles.taglineLine} />
          <Text style={styles.tagline}>ALREADY GOING. HAPPY TO HELP.</Text>
          <View style={styles.taglineLine} />
        </View>
        <View style={styles.routeScene}>
          <View style={styles.sun} />
          <View style={styles.hillBack} />
          <View style={styles.hillFront} />
          <View style={styles.road} />
          <View style={styles.roadMark} />
        </View>
      </View>

      <View style={styles.benefitsPanel}>
        {benefits.map((benefit, index) => (
          <View key={benefit.title} style={[styles.benefit, index > 0 && styles.benefitBorder]}>
            <View style={styles.benefitIcon}>
              <Text style={styles.iconText}>{benefit.icon}</Text>
            </View>
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button title="Get Started" onPress={onGetStarted} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log in to your account"
          onPress={onLogIn}
          style={({ pressed }) => [styles.loginButton, pressed && styles.loginPressed]}
        >
          <Text style={styles.loginIcon}>♙</Text>
          <Text style={styles.loginLabel}>Log In to Your Account</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    backgroundColor: theme.colors.surface,
    paddingBottom: theme.spacing.lg,
  },
  hero: {
    backgroundColor: theme.colors.background,
    minHeight: 610,
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 48,
  },
  skyGlow: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 240,
    height: 430,
    left: -70,
    opacity: 0.7,
    position: 'absolute',
    right: -70,
    top: -180,
  },
  brandMark: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: theme.colors.primary,
    borderRadius: 78,
    borderWidth: 5,
    height: 156,
    justifyContent: 'center',
    width: 156,
  },
  logo: {
    color: theme.colors.primary,
    fontSize: 54,
    fontWeight: '800',
    letterSpacing: -2,
  },
  brandName: {
    color: theme.colors.primary,
    fontSize: 42,
    fontStyle: 'italic',
    fontWeight: '800',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  taglineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  taglineLine: {
    backgroundColor: theme.colors.primary,
    height: 2,
    width: 30,
  },
  tagline: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  routeScene: {
    bottom: 0,
    height: 270,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
  },
  sun: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 42,
    bottom: 150,
    height: 84,
    left: 30,
    opacity: 0.75,
    position: 'absolute',
    width: 84,
  },
  hillBack: {
    backgroundColor: theme.colors.secondarySoft,
    borderRadius: 180,
    bottom: 40,
    height: 220,
    left: -80,
    position: 'absolute',
    transform: [{ scaleX: 1.8 }],
    width: 300,
  },
  hillFront: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 180,
    bottom: -70,
    height: 240,
    position: 'absolute',
    right: -60,
    transform: [{ scaleX: 1.7 }],
    width: 360,
  },
  road: {
    backgroundColor: theme.colors.surface,
    bottom: -90,
    height: 270,
    left: '42%',
    position: 'absolute',
    transform: [{ rotate: '8deg' }],
    width: 120,
  },
  roadMark: {
    backgroundColor: theme.colors.secondary,
    bottom: 0,
    height: 100,
    left: '51%',
    position: 'absolute',
    width: 5,
  },
  benefitsPanel: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
  },
  benefit: {
    alignItems: 'center',
    flex: 1,
    minHeight: 160,
    paddingHorizontal: theme.spacing.xs,
  },
  benefitBorder: {
    borderLeftColor: theme.colors.primarySoft,
    borderLeftWidth: 1,
  },
  benefitIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    width: 60,
  },
  iconText: {
    color: theme.colors.onPrimary,
    fontSize: 25,
    fontWeight: '700',
  },
  benefitTitle: {
    color: theme.colors.onPrimary,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'center',
  },
  actions: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    marginTop: -1,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
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
  loginPressed: {
    backgroundColor: theme.colors.primarySoft,
  },
  loginIcon: {
    color: theme.colors.primary,
    fontSize: 28,
    marginRight: theme.spacing.sm,
  },
  loginLabel: {
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
}));