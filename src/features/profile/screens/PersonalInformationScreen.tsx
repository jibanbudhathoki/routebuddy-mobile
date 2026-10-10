import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { PersonalInformationFields } from "../components/PersonalInformationFields";
import { useProfile } from "../hooks/useProfile";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export function PersonalInformationScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { profile, isLoading, updateProfile } = useProfile();
  const { theme } = useUnistyles();

  useEffect(() => {
    if (!profile) return;

    const nameParts = profile.displayName
      ? profile.displayName.split(" ")
      : [];
    setFirstName(nameParts[0] || "");
    setLastName(nameParts.length > 1 ? nameParts[nameParts.length - 1] : "");
    setEmail(profile.email || "");
    setPhone(profile.phone || "");
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

    if (success) router.back();
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Personal Information</Text>
          </View>
        </View>

        <PersonalInformationFields
          photoUrl={profile?.photoUrl}
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          errors={errors}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
        />
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
  footer: {
    padding: 16,
    paddingBottom: 24,
  },
}));
