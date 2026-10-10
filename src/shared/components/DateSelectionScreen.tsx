import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { getTopSafeAreaInset } from "../utils/safeArea";
import { DateSelectionCalendar } from "./DateSelectionCalendar";
import { PrimaryButton } from "./PrimaryButton";

export interface DateSelectionScreenProps {
  headerTitle: string;
  title: string;
  subtitle?: string;
  initialDate?: Date;
  onContinue: (date: Date | null) => void;
  onClose: () => void;
}

function DateSelectionHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={onClose}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={32}
          color={theme.colors.text}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.headerButton} onPress={onClose}>
        <MaterialCommunityIcons
          name="close"
          size={28}
          color={theme.colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}

function useDateSelection(
  initialDate: Date | undefined,
  onContinue: DateSelectionScreenProps["onContinue"],
) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate || null,
  );

  const changeMonth = (amount: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + amount, 1),
    );
  };

  const changeYear = (amount: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear() + amount,
        currentDate.getMonth(),
        1,
      ),
    );
  };

  const continueWithSelectedDate = () => {
    if (!selectedDate) {
      onContinue(null);
      return;
    }

    const now = new Date();
    onContinue(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds(),
      ),
    );
  };

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    changeMonth,
    changeYear,
    continueWithSelectedDate,
  };
}

export function DateSelectionScreen({
  headerTitle,
  title,
  subtitle,
  initialDate,
  onContinue,
  onClose,
}: DateSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    changeMonth,
    changeYear,
    continueWithSelectedDate,
  } = useDateSelection(initialDate, onContinue);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingTop: getTopSafeAreaInset(insets.top),
        },
      ]}
    >
      <DateSelectionHeader title={headerTitle} onClose={onClose} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <DateSelectionCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onChangeMonth={changeMonth}
          onChangeYear={changeYear}
        />
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          onPress={continueWithSelectedDate}
          disabled={!selectedDate}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  titleSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
