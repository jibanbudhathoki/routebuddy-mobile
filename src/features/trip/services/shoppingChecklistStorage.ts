import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

const checkedItemsSchema = z.array(z.string().min(1));
const storageKey = (tripUid: string) =>
  `trip-shopping-checklist:${encodeURIComponent(tripUid)}`;

export const shoppingChecklistStorage = {
  async getCheckedItems(tripUid: string): Promise<string[]> {
    const value = await AsyncStorage.getItem(storageKey(tripUid));
    if (value === null) return [];

    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(value);
    } catch {
      throw new Error("Saved shopping checklist data could not be read.");
    }

    const parsed = checkedItemsSchema.safeParse(parsedValue);
    if (!parsed.success) {
      throw new Error("Saved shopping checklist data is invalid.");
    }
    return parsed.data;
  },

  async saveCheckedItems(
    tripUid: string,
    checkedItems: string[],
  ): Promise<void> {
    const parsed = checkedItemsSchema.safeParse([...new Set(checkedItems)]);
    if (!parsed.success) {
      throw new Error("Shopping checklist contains invalid item selections.");
    }
    await AsyncStorage.setItem(
      storageKey(tripUid),
      JSON.stringify(parsed.data),
    );
  },
};
