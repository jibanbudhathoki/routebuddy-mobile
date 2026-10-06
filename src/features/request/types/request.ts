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

export interface MyRequestListItem {
  uid: string;
  neededBy: string;
  latestDeliveryBy: string;
  status: string;
  totalCost: string | null;
  deliveryCity: string;
  origin: string;
  destination: string;
  stores: string[];
  requester: {
    name: string;
    photoUrl?: string | null;
  };
  driver: {
    name: string;
    photoUrl?: string | null;
  } | null;
}

export interface ListMyRequestsResponse {
  success: boolean;
  message: string;
  data: MyRequestListItem[];
  total: number;
  page: number;
  limit: number;
}
