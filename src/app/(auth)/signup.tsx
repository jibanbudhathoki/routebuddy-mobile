import { useRouter } from 'expo-router';
import { SignupScreen } from '../../features/auth/screens/SignupScreen';

export default function SignupRoute() {
  const router = useRouter();

  return (
    <SignupScreen
      onEmailVerified={() => router.replace('/(auth)/login')}
      onLogIn={() => router.push('/(auth)/login')}
    />
  );
}
