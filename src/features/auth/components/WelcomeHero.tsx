import { Image, ImageBackground, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type WelcomeHeroProps = {
  variant?: 'curved' | 'flat';
};

export function WelcomeHero({ variant = 'curved' }: WelcomeHeroProps) {
  return (
    <View style={styles.heroWrapper(variant)}>
      <ImageBackground
        source={require('../../../../assets/rural-road-bg.png')}
        resizeMode="cover"
        style={styles.hero(variant)}
      >
        <View style={styles.heroShade} />
        <Image source={require('../../../../assets/rb-logo.png')} style={styles.logo(variant)} />
        <Text style={styles.brandName(variant)}>Route Buddy</Text>
        <View style={styles.taglineRow(variant)}>
          <View style={styles.taglineLine} />
          <Text style={styles.tagline}>ALREADY GOING. HAPPY TO HELP.</Text>
          <View style={styles.taglineLine} />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  heroWrapper: (variant: 'curved' | 'flat') => ({
    flex: 1,
    backgroundColor: variant === 'curved' ? theme.colors.primary : 'transparent',
    overflow: 'hidden',
  }),
  hero: (variant: 'curved' | 'flat') => ({
    flex: 1,
    justifyContent: 'flex-start',
    minHeight: 0,
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 60,
    ...(variant === 'curved'
      ? {
          borderBottomLeftRadius: 300,
          borderBottomRightRadius: 300,
          borderLeftWidth: 40,
          borderRightWidth: 40,
          borderBottomWidth: 3,
          borderColor: 'rgba(255, 255, 255, 0.6)',
          transform: [{ scaleX: 1.25 }],
        }
      : {}),
  }),
  heroShade: {
    backgroundColor: theme.colors.background,
    bottom: 0,
    left: 0,
    opacity: 0.18,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  logo: (variant: 'curved' | 'flat') => ({
    alignSelf: 'center',
    height: 150,
    marginTop: theme.spacing.sm,
    width: 150,
    ...(variant === 'curved' ? { transform: [{ scaleX: 0.85 }] } : {}),
  }),
  brandName: (variant: 'curved' | 'flat') => ({
    color: theme.colors.text,
    fontSize: 34,
    fontStyle: 'italic',
    fontWeight: '800',
    marginTop: theme.spacing.xs,
    textAlign: 'center',
    ...(variant === 'curved' ? { transform: [{ scaleX: 0.833 }] } : {}),
  }),
  taglineRow: (variant: 'curved' | 'flat') => ({
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
    justifyContent: 'center',
    marginTop: theme.spacing.xs,
    ...(variant === 'curved' ? { transform: [{ scaleX: 0.833 }] } : {}),
  }),
  taglineLine: {
    backgroundColor: theme.colors.primary,
    height: 2,
    width: 24,
  },
  tagline: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
}));
