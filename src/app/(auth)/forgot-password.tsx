import { useRouter } from 'expo-router';
import { ForgotPasswordScreen } from '../../features/auth/screens/ForgotPasswordScreen';

export default function ForgotPasswordRoute() {
  const router = useRouter();

  return (
    <ForgotPasswordScreen
      onBack={() => router.back()}
      onCodeSent={(email) =>
        router.push({
          pathname: '/verify-reset-code',
          params: { email },
        })
      }
    />
  );
}
