import { useLocalSearchParams } from "expo-router";
import { ProfileAddressFormScreen } from "../../../features/profile/screens/ProfileAddressFormScreen";

export default function EditProfileAddressScreen() {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  return <ProfileAddressFormScreen addressUid={uid} />;
}
