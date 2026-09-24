export interface RequestItem {
  id: string;
  name: string;
  description: string;
  estimatedPrice: string;
}

export interface CreateRequestPayload {
  stores: string[];
  deliveryAddress: string;
  deliveryCityUid: string;
  itemsInstructions: string;
  dayNeeded: string;
  latestDeliveryTime: string;
  items: RequestItem[];
}
