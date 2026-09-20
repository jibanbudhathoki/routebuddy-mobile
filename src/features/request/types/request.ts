export interface RequestItem {
  id: string;
  name: string;
  description: string;
  estimatedPrice: string;
}

export interface CreateRequestPayload {
  stores: string[]; // store IDs
  deliveryAddress: string; 
  itemsInstructions: string;
  dayNeeded: string; // ISO date string
  latestDeliveryTime: string; // ISO time string
  items: RequestItem[];
}
