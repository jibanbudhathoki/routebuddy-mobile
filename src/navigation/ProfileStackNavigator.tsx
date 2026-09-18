import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileScreen } from "../features/profile/screens/ProfileScreen";
import { PersonalInformationScreen } from "../features/profile/screens/PersonalInformationScreen";

export type ProfileStackParamList = {
  ProfileMain: undefined;
  PersonalInformation: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformationScreen}
      />
    </Stack.Navigator>
  );
}
