import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { AuthScreen } from '../features/auth/screens/AuthScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { WelcomeScreen } from '../features/auth/screens/WelcomeScreen';

export function App() {
  const [screen, setScreen] = useState<'welcome' | 'auth' | 'home'>('welcome');

  return (
    <>
      {screen === 'home' ? (
        <HomeScreen />
      ) : screen === 'auth' ? (
        <AuthScreen onAuthenticated={() => setScreen('home')} />
      ) : (
        <WelcomeScreen
          onGetStarted={() => setScreen('auth')}
          onLogIn={() => setScreen('auth')}
        />
      )}
      <StatusBar style="auto" />
    </>
  );
}