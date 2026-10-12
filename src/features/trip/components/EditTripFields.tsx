import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { FormInput } from "../../../shared/components/FormInput";
import type { City } from "../../../shared/city/types/city";
import type { Store } from "../../../shared/store/types/store";
import { EditTripDateTimeField } from "./EditTripDateTimeField";
import {
  EditTripSelectionModal,
  type EditTripOption,
} from "./EditTripSelectionModal";
import { styles } from "./editTripFields.styles";
import type { TripDetailsResponse } from "../types/trip";
import type { EditTripFormValues } from "../types/editTripForm";

type SelectionKind = "origin" | "destination" | "stores" | null;

interface EditTripFieldsProps {
  trip: TripDetailsResponse;
  form: EditTripFormValues;
  cities: City[];
  stores: Store[];
  storesLoading: boolean;
  onChange: (updates: Partial<EditTripFormValues>) => void;
}

export function EditTripFields({
  trip,
  form,
  cities,
  stores,
  storesLoading,
  onChange,
}: EditTripFieldsProps) {
  const { theme } = useUnistyles();
  const [selection, setSelection] = useState<SelectionKind>(null);
  const originCity = cities.find((city) => city.uid === form.originCityUid);
  const destinationCity = cities.find(
    (city) => city.uid === form.destinationCityUid,
  );
  const selectedStores = useMemo(
    () => stores.filter((store) => form.stores.includes(store.uid)),
    [form.stores, stores],
  );
  const cityOptions: EditTripOption[] = cities.map((city) => ({
    uid: city.uid,
    label: city.name,
  }));
  const storeOptions: EditTripOption[] = stores.map((store) => ({
    uid: store.uid,
    label: store.name,
    description: [store.city?.name, store.province?.name]
      .filter(Boolean)
      .join(", "),
  }));
  const selectedUids =
    selection === "origin"
      ? [form.originCityUid]
      : selection === "destination"
        ? [form.destinationCityUid]
        : form.stores;

  function toggleSelection(uid: string) {
    if (selection === "origin") {
      onChange({ originCityUid: uid });
    } else if (selection === "destination") {
      onChange({ destinationCityUid: uid });
    } else if (selection === "stores") {
      onChange({
        stores: form.stores.includes(uid)
          ? form.stores.filter((storeUid) => storeUid !== uid)
          : [...form.stores, uid],
      });
    }
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.notice}>
          <MaterialCommunityIcons
            name="information-outline"
            size={17}
            color={theme.colors.primary}
          />
          <Text style={styles.noticeText}>
            Changes you save will be visible to all requesters.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Route</Text>
        <View style={styles.row}>
          <SelectionField
            label="From"
            value={originCity?.name ?? trip.origin}
            onPress={() => setSelection("origin")}
          />
          <SelectionField
            label="To"
            value={destinationCity?.name ?? trip.destination}
            onPress={() => setSelection("destination")}
          />
        </View>

        <Text style={styles.sectionTitle}>Trip Date &amp; Time</Text>
        <EditTripDateTimeField
          label="Departure Date & Time"
          value={form.departureAt}
          onChange={(departureAt) => onChange({ departureAt })}
        />
        <EditTripDateTimeField
          label="Order Cut-off Time"
          value={form.orderCutoffAt}
          onChange={(orderCutoffAt) => onChange({ orderCutoffAt })}
        />
        <EditTripDateTimeField
          label="Latest Delivery By"
          value={form.deliveryLatestBy}
          minimumDate={new Date(form.departureAt)}
          onChange={(deliveryLatestBy) => onChange({ deliveryLatestBy })}
        />

        <Text style={styles.sectionTitle}>Order Settings</Text>
        <View style={styles.capacityRow}>
          <Text style={styles.fieldLabel}>Maximum number of orders</Text>
          <View style={styles.stepper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Decrease maximum orders"
              disabled={form.capacity <= 1}
              onPress={() =>
                onChange({ capacity: Math.max(1, form.capacity - 1) })
              }
              style={styles.stepperButton}
            >
              <MaterialCommunityIcons
                name="minus"
                size={18}
                color={theme.colors.primary}
              />
            </Pressable>
            <Text style={styles.capacityValue}>{form.capacity}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Increase maximum orders"
              onPress={() => onChange({ capacity: form.capacity + 1 })}
              style={styles.stepperButton}
            >
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        </View>
        <FormInput
          label="Trip Price (Optional)"
          icon="cash"
          placeholder="Enter price"
          value={form.price}
          keyboardType="decimal-pad"
          onChangeText={(price) =>
            /^\d*(\.\d*)?$/.test(price) && onChange({ price })
          }
        />

        <Text style={styles.sectionTitle}>Stores</Text>
        <SelectionField
          label="Stores requesters can order from"
          value={
            storesLoading
              ? "Loading stores..."
              : selectedStores.map((store) => store.name).join(", ") ||
                "Select stores"
          }
          onPress={() => setSelection("stores")}
        />
        <FormInput
          label="Trip Notes (Optional)"
          placeholder="Add notes or instructions for requesters"
          value={form.notes}
          onChangeText={(notes) => onChange({ notes })}
          multiline
          maxLength={500}
        />
      </ScrollView>

      <EditTripSelectionModal
        visible={selection !== null}
        title={
          selection === "origin"
            ? "Select starting city"
            : selection === "destination"
              ? "Select destination city"
              : "Select stores"
        }
        options={selection === "stores" ? storeOptions : cityOptions}
        selectedUids={selectedUids}
        multiple={selection === "stores"}
        onToggle={toggleSelection}
        onClose={() => setSelection(null)}
      />
    </>
  );
}

function SelectionField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.selectionContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={styles.selectionField}
      >
        <Text numberOfLines={2} style={styles.selectionValue}>
          {value}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={18}
          color={theme.colors.muted}
        />
      </Pressable>
    </View>
  );
}
