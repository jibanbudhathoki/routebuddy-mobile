import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryButton } from "./PrimaryButton";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateCalendar(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days: (Date | null)[] = [];

  const firstDayIndex = date.getDay();
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export interface DateSelectionScreenProps {
  headerTitle: string;
  title: string;
  subtitle?: string;
  initialDate?: Date;
  onContinue: (date: Date | null) => void;
  onClose: () => void;
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
  const { theme } = useUnistyles();

  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate || null,
  );

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const handlePrevYear = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1),
    );
  };

  const handleNextYear = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1),
    );
  };

  const weeks = generateCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );
  const monthYearString = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={onClose}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={onClose}>
          <MaterialCommunityIcons
            name="close"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <View style={styles.arrowGroup}>
              <TouchableOpacity
                style={styles.chevronButton}
                onPress={handlePrevYear}
              >
                <MaterialCommunityIcons
                  name="chevron-double-left"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chevronButton}
                onPress={handlePrevMonth}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.monthText}>{monthYearString}</Text>

            <View style={styles.arrowGroup}>
              <TouchableOpacity
                style={styles.chevronButton}
                onPress={handleNextMonth}
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chevronButton}
                onPress={handleNextYear}
              >
                <MaterialCommunityIcons
                  name="chevron-double-right"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.daysOfWeek}>
            {DAYS_OF_WEEK.map((day) => (
              <Text key={day} style={styles.dayOfWeekText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((dateObj, dayIndex) => {
                  const isSelected =
                    dateObj &&
                    selectedDate &&
                    selectedDate.getDate() === dateObj.getDate() &&
                    selectedDate.getMonth() === dateObj.getMonth() &&
                    selectedDate.getFullYear() === dateObj.getFullYear();

                  // Ensure past dates can't be selected
                  const isPast = dateObj
                    ? dateObj.getTime() < new Date().setHours(0, 0, 0, 0)
                    : false;

                  return (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.dayCell,
                        isSelected && styles.dayCellSelected,
                        isPast && { opacity: 0.3 },
                      ]}
                      onPress={() => {
                        if (dateObj && !isPast) {
                          setSelectedDate(dateObj);
                        }
                      }}
                      disabled={!dateObj || isPast}
                    >
                      {dateObj && (
                        <Text
                          style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                          ]}
                        >
                          {dateObj.getDate()}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          onPress={() => onContinue(selectedDate)}
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
  calendarCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  chevronButton: {
    padding: theme.spacing.xs,
  },
  arrowGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  daysOfWeek: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  dayOfWeekText: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.muted,
  },
  calendarGrid: {
    width: "100%",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  dayCellSelected: {
    backgroundColor: theme.colors.primary,
  },
  dayText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  dayTextSelected: {
    color: theme.colors.onPrimary,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
