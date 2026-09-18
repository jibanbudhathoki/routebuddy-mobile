import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { z } from "zod";
import { FormInput } from "../../../shared/components/FormInput";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useProfile } from "../hooks/useProfile";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export function PersonalInformationScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { profile, isLoading, updateProfile } = useProfile();
  const { theme } = useUnistyles();

  useEffect(() => {
    if (profile) {
      const nameParts = profile.displayName
        ? profile.displayName.split(" ")
        : [];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.length > 1 ? nameParts[nameParts.length - 1] : "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSave = async () => {
    const result = personalInfoSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
    });
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }
    setErrors({});
    setIsSaving(true);

    const { success } = await updateProfile({
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      phone: result.data.phone,
    });

    setIsSaving(false);
    if (success) {
      navigation.goBack();
    } else {
      // In a real app, show a toast or alert here
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Personal Information</Text>
            {/* <Text style={styles.subtitle}>Update your personal details and contact{'\n'}information.</Text> */}
          </View>
        </View>

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
                    profile?.photoUrl ||
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
                onChangeText={setFirstName}
                error={errors.firstName}
              />
            </View>
            <View style={styles.halfInput}>
              <FormInput
                label="Last Name"
                placeholder="D."
                value={lastName}
                onChangeText={setLastName}
                error={errors.lastName}
              />
            </View>
          </View>

          <Text style={styles.sectionLabel}>Email Address</Text>
          <FormInput
            icon="email-outline"
            placeholder="john.doe@email.com"
            value={email}
            onChangeText={setEmail}
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
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phone}
          />
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton
            title="Save Changes"
            onPress={handleSave}
            loading={isSaving}
            disabled={isLoading || isSaving}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {},
  headerTextContainer: {
    alignItems: "center",
    marginTop: -24,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  // subtitle: {
  //   color: theme.colors.muted,
  //   fontSize: 14,
  //   textAlign: 'center',
  //   lineHeight: 20,
  // },
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
  footer: {
    padding: 16,
    paddingBottom: 24,
  },
}));
