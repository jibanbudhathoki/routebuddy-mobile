import { useRouter } from 'expo-router';
import { SignupScreen } from '../../features/auth/screens/SignupScreen';

export default function SignupRoute() {
  const router = useRouter();

  return (
    <SignupScreen
      onAuthenticated={() => router.replace('/(tabs)')}
      onLogIn={() => router.push('/(auth)/login')}
    />
  );
}
