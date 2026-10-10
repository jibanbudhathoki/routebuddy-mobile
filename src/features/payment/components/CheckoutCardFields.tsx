import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardField } from "@stripe/stripe-react-native";
import { Text, TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface CheckoutCardFieldsProps {
  nameOnCard: string;
  onChangeName: (name: string) => void;
  onCardValidityChange: (isValid: boolean) => void;
  isFormValid: boolean;
  hasFailed: boolean;
}

export function CheckoutCardFields({
  nameOnCard,
  onChangeName,
  onCardValidityChange,
  isFormValid,
  hasFailed,
}: CheckoutCardFieldsProps) {
  const { theme } = useUnistyles();
  const isNameValid = nameOnCard.trim().length > 0;

  return (
    <>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Card Details</Text>
        <View
          style={[
            styles.inputWrapper,
            styles.cardFieldWrapper,
            hasFailed && !isFormValid && styles.inputWrapperError,
          ]}
        >
          <CardField
            postalCodeEnabled={false}
            onCardChange={(cardDetails) =>
              onCardValidityChange(cardDetails.complete)
            }
            style={styles.cardField}
            cardStyle={{
              backgroundColor: theme.colors.surface,
              textColor: theme.colors.text,
              placeholderColor: theme.colors.muted,
              fontSize: 14,
              borderWidth: 0,
            }}
          />
        </View>
        {hasFailed && !isFormValid ? (
          <Text style={styles.errorText}>
            Please enter complete and valid card details.
          </Text>
        ) : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Name on Card</Text>
        <View
          style={[
            styles.inputWrapper,
            hasFailed && !isNameValid && styles.inputWrapperError,
          ]}
        >
          <MaterialCommunityIcons
            name="account-outline"
            size={20}
            color={theme.colors.text}
            style={styles.nameIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="e.g., John Smith"
            placeholderTextColor={theme.colors.muted}
            value={nameOnCard}
            onChangeText={onChangeName}
          />
        </View>
        {hasFailed && !isNameValid ? (
          <Text style={styles.errorText}>
            Please enter the name on your card.
          </Text>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  fieldContainer: {
    marginBottom: theme.spacing.md,
  },
  fieldLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    marginBottom: 8,
  },
  inputWrapper: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    height: 50,
    paddingHorizontal: theme.spacing.md,
  },
  cardFieldWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inputWrapperError: {
    borderColor: theme.colors.error,
  },
  cardField: {
    height: 50,
    width: "100%",
  },
  nameIcon: {
    marginRight: theme.spacing.sm,
    opacity: 0.5,
  },
  input: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
}));
