import { useRouter } from 'expo-router';
import { AuthScreen } from '../../features/auth/screens/AuthScreen';

export default function LoginRoute() {
  const router = useRouter();

  return (
    <AuthScreen
      onAuthenticated={() => router.replace('/(tabs)')}
      onSignUp={() => router.push('/(auth)/signup')}
    />
  );
}
