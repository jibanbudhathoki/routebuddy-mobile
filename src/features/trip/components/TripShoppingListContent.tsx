import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import type { RequestDetailsResponse } from "../../request/types/request";
import { styles } from "./tripShoppingScreen.styles";

export interface ShoppingOrder {
  uid: string;
  requesterName: string;
  request: RequestDetailsResponse;
}

interface TripShoppingListContentProps {
  orders: ShoppingOrder[];
  checkedItems: Set<string>;
  onToggleItem: (itemKey: string) => void;
}

export function TripShoppingListContent({
  orders,
  checkedItems,
  onToggleItem,
}: TripShoppingListContentProps) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.orderList}>
      {orders.map((order) => (
        <View key={order.uid} style={styles.orderCard}>
          <View style={styles.requesterHeader}>
            <View style={styles.requesterIcon}>
              <MaterialCommunityIcons
                name="account-outline"
                size={18}
                color={theme.colors.text}
              />
            </View>
            <View style={styles.requesterInfo}>
              <Text style={styles.requesterLabel}>REQUESTER</Text>
              <Text numberOfLines={1} style={styles.requesterName}>
                {order.requesterName}
              </Text>
            </View>
            <Text style={styles.itemsCount}>
              {order.request.items.length} items
            </Text>
          </View>

          {order.request.stores.map((store) => (
            <View key={store.uid} style={styles.storeHeader}>
              <MaterialCommunityIcons
                name="store-outline"
                size={15}
                color={theme.colors.muted}
              />
              <Text style={styles.storeName}>{store.name}</Text>
            </View>
          ))}

          {order.request.items.map((item, index) => {
            const itemKey = `${order.uid}:${index}`;
            const isChecked = checkedItems.has(itemKey);
            return (
              <Pressable
                key={itemKey}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isChecked }}
                onPress={() => onToggleItem(itemKey)}
                style={styles.itemRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    isChecked && styles.checkboxChecked,
                  ]}
                >
                  {isChecked ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color={theme.colors.onPrimary}
                    />
                  ) : null}
                </View>
                <View style={styles.itemInfo}>
                  <Text
                    style={[
                      styles.itemName,
                      isChecked && styles.itemChecked,
                    ]}
                  >
                    {item.item}
                  </Text>
                  {item.description ? (
                    <Text style={styles.itemDescription}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.itemPrice}>{item.estimatePrice}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
