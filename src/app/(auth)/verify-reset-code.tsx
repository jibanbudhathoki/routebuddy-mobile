import { useLocalSearchParams, useRouter } from 'expo-router';
import { VerifyResetCodeScreen } from '../../features/auth/screens/VerifyResetCodeScreen';

export default function VerifyResetCodeRoute() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <VerifyResetCodeScreen
      email={typeof email === 'string' ? email : ''}
      onBack={() => router.back()}
      onResetSuccess={() => router.replace('/(auth)/login')}
    />
  );
}
