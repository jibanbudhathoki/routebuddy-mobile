import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

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

type CalendarWeek = (Date | null)[];

interface DateSelectionCalendarProps {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (amount: number) => void;
  onChangeYear: (amount: number) => void;
}

function generateCalendar(year: number, month: number): CalendarWeek[] {
  const date = new Date(year, month, 1);
  const days: (Date | null)[] = [];

  for (let i = 0; i < date.getDay(); i++) {
    days.push(null);
  }

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function MonthNavigation({
  monthYearString,
  onChangeMonth,
  onChangeYear,
}: {
  monthYearString: string;
  onChangeMonth: (amount: number) => void;
  onChangeYear: (amount: number) => void;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.calendarHeader}>
      <View style={styles.arrowGroup}>
        <TouchableOpacity
          style={styles.chevronButton}
          onPress={() => onChangeYear(-1)}
        >
          <MaterialCommunityIcons
            name="chevron-double-left"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chevronButton}
          onPress={() => onChangeMonth(-1)}
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
          onPress={() => onChangeMonth(1)}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chevronButton}
          onPress={() => onChangeYear(1)}
        >
          <MaterialCommunityIcons
            name="chevron-double-right"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CalendarDay({
  date,
  selectedDate,
  onSelect,
}: {
  date: Date | null;
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}) {
  const isSelected =
    date !== null &&
    selectedDate !== null &&
    selectedDate.getDate() === date.getDate() &&
    selectedDate.getMonth() === date.getMonth() &&
    selectedDate.getFullYear() === date.getFullYear();
  const isPast = date
    ? date.getTime() < new Date().setHours(0, 0, 0, 0)
    : false;

  return (
    <TouchableOpacity
      style={[
        styles.dayCell,
        isSelected && styles.dayCellSelected,
        isPast && { opacity: 0.3 },
      ]}
      onPress={() => {
        if (date && !isPast) {
          onSelect(date);
        }
      }}
      disabled={!date || isPast}
    >
      {date && (
        <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
          {date.getDate()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function DateSelectionCalendar({
  currentDate,
  selectedDate,
  onSelectDate,
  onChangeMonth,
  onChangeYear,
}: DateSelectionCalendarProps) {
  const weeks = generateCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );
  const monthYearString = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <View style={styles.calendarCard}>
      <MonthNavigation
        monthYearString={monthYearString}
        onChangeMonth={onChangeMonth}
        onChangeYear={onChangeYear}
      />
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
            {week.map((date, dayIndex) => (
              <CalendarDay
                key={dayIndex}
                date={date}
                selectedDate={selectedDate}
                onSelect={onSelectDate}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
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
}));
