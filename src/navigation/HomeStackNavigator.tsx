import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../features/home/screens/HomeScreen";
import { PostTripScreen } from "../features/trip/screens/PostTripScreen";
import { SelectStoreScreen } from "../features/trip/screens/SelectStoreScreen";
import { OrderCutOffScreen } from "../features/trip/screens/OrderCutOffScreen";
import { DayOfDepartureScreen } from "../features/trip/screens/DayOfDepartureScreen";
import { LatestDeliveryTimeScreen } from "../features/trip/screens/LatestDeliveryTimeScreen";
import { LocationSearchScreen } from "../features/trip/screens/LocationSearchScreen";
import { ReviewTripScreen } from "../features/trip/screens/ReviewTripScreen";
import { PostSuccessScreen } from "../features/trip/screens/PostSuccessScreen";
import { TripCreationProvider } from "../features/trip/context/TripCreationContext";

const Stack = createNativeStackNavigator();

export function HomeStackNavigator() {
  return (
    <TripCreationProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen
          name="PostTrip"
          component={PostTripScreen}
          options={{ presentation: "fullScreenModal" }}
        />
        <Stack.Screen name="SelectStore" component={SelectStoreScreen} />
        <Stack.Screen name="OrderCutOff" component={OrderCutOffScreen} />
        <Stack.Screen name="DayOfDeparture" component={DayOfDepartureScreen} />
        <Stack.Screen
          name="LatestDeliveryTime"
          component={LatestDeliveryTimeScreen}
        />
        <Stack.Screen name="LocationSearch" component={LocationSearchScreen} />
        <Stack.Screen name="ReviewTrip" component={ReviewTripScreen} />
        <Stack.Screen
          name="PostSuccess"
          component={PostSuccessScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </TripCreationProvider>
  );
}
