import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NavigationContainer } from "@react-navigation/native";
import { AuthScreen } from "../features/auth/screens/AuthScreen";
import { SignupScreen } from "../features/auth/screens/SignupScreen";
import { WelcomeScreen } from "../features/auth/screens/WelcomeScreen";
import { MainTabNavigator } from "../navigation/MainTabNavigator";
import { getAuthSession } from "../features/auth/services/authStorage";
import { View, ActivityIndicator } from "react-native";

export function App() {
  const [screen, setScreen] = useState<"welcome" | "signup" | "login" | "home" | "loading">(
    "loading",
  );

  useEffect(() => {
    async function checkAuth() {
      const session = await getAuthSession();
      if (session) {
        setScreen("home");
      } else {
        setScreen("welcome");
      }
    }
    checkAuth();
  }, []);

  if (screen === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0B2447" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {screen === "home" ? (
        <NavigationContainer>
          <MainTabNavigator />
        </NavigationContainer>
      ) : screen === "login" ? (
        <AuthScreen
          onAuthenticated={(destination: "home" | "signup" = "home") =>
            setScreen(destination)
          }
          onSignUp={() => setScreen("signup")}
        />
      ) : screen === "signup" ? (
        <SignupScreen
          onAuthenticated={() => setScreen("home")}
          onLogIn={() => setScreen("login")}
        />
      ) : (
        <WelcomeScreen
          onGetStarted={() => setScreen("signup")}
          onLogIn={() => setScreen("login")}
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
