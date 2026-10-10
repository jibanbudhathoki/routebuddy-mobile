import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { FormInput } from "../../../shared/components/FormInput";

type PersonalInformationFieldsProps = {
  photoUrl?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  errors: Record<string, string>;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
};

export function PersonalInformationFields({
  photoUrl,
  firstName,
  lastName,
  email,
  phone,
  errors,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
}: PersonalInformationFieldsProps) {
  const { theme } = useUnistyles();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionLabel}>Profile Photo</Text>
      <View style={styles.photoSection}>
        <View style={styles.photoContainer}>
          <Image
            source={{
              uri:
                photoUrl ||
                +encodeURIComponent(firstName + " " + lastName) +
                  "&background=0D8ABC&color=fff&size=200",
            }}
            style={styles.profilePhoto}
          />
          <View style={styles.cameraIconContainer}>
            <MaterialCommunityIcons
              name="camera"
              size={16}
              color={theme.colors.onPrimary}
            />
          </View>
        </View>
        <View style={styles.photoActions}>
          <Text style={styles.photoLabel}>Profile Photo</Text>
          <Text style={styles.photoDesc}>
            Add a profile photo so other{"\n"}members can recognize you.
          </Text>
          <View style={styles.photoButtonsRow}>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deletePhotoButton}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color={theme.colors.muted}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Full Name</Text>
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <FormInput
            label="First Name"
            placeholder="John"
            value={firstName}
            onChangeText={onFirstNameChange}
            error={errors.firstName}
          />
        </View>
        <View style={styles.halfInput}>
          <FormInput
            label="Last Name"
            placeholder="D."
            value={lastName}
            onChangeText={onLastNameChange}
            error={errors.lastName}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>Email Address</Text>
      <FormInput
        icon="email-outline"
        placeholder="john.doe@email.com"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={false}
        error={errors.email}
      />

      <Text style={styles.sectionLabel}>Phone Number</Text>
      <FormInput
        icon="phone-outline"
        placeholder="(204) 555-0123"
        value={phone}
        onChangeText={onPhoneChange}
        keyboardType="phone-pad"
        error={errors.phone}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  photoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  photoContainer: {
    marginRight: 20,
    position: "relative",
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.text,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  photoActions: {
    flex: 1,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  photoDesc: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 18,
    marginBottom: 12,
  },
  photoButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  changePhotoButton: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  deletePhotoButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.primarySoft,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8ECF2",
    marginVertical: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
}));
