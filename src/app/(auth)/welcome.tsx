import { useRouter } from 'expo-router';
import { WelcomeScreen } from '../../features/auth/screens/WelcomeScreen';

export default function WelcomeRoute() {
  const router = useRouter();

  return (
    <WelcomeScreen
      onGetStarted={() => router.push('/(auth)/signup')}
      onLogIn={() => router.push('/(auth)/login')}
    />
  );
}
