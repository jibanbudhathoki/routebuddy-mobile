import type { HomeFilterOption } from "../types/homeFilters";

export function createTextFilterOptions(
  values: string[],
  allLabel: string,
): HomeFilterOption[] {
  const uniqueValues = new Map<string, string>();
  values.forEach((value) => {
    const label = value.trim();
    const key = normalizeFilterValue(label);
    if (key && !uniqueValues.has(key)) uniqueValues.set(key, label);
  });

  return [
    { value: "", label: allLabel },
    ...Array.from(uniqueValues.values())
      .sort((left, right) => left.localeCompare(right))
      .map((label) => ({ value: label, label })),
  ];
}

export function createDateFilterOptions(
  values: string[],
  useUtc = false,
): HomeFilterOption[] {
  const uniqueDates = new Map<string, string>();

  values.forEach((value) => {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return;
    const key = getDateKey(date, useUtc);
    if (!uniqueDates.has(key)) {
      uniqueDates.set(
        key,
        date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          ...(useUtc ? { timeZone: "UTC" } : {}),
        }),
      );
    }
  });

  return [
    { value: "", label: "Any date" },
    ...Array.from(uniqueDates.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([value, label]) => ({ value, label })),
  ];
}

export function normalizeFilterValue(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function getFilterDateKey(value: string, useUtc = false): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return getDateKey(date, useUtc);
}

function getDateKey(date: Date, useUtc: boolean): string {
  const year = useUtc ? date.getUTCFullYear() : date.getFullYear();
  const month = (useUtc ? date.getUTCMonth() : date.getMonth()) + 1;
  const day = useUtc ? date.getUTCDate() : date.getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
