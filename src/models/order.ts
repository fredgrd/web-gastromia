import { CartItemSnapshot } from "./cart-snapshot";

// --------------------------------------------------------------------------
// Interfaces

export interface CreateOrderData {
  items_snapshot: CartItemSnapshot[];
  interval: string;
  cash_payment: boolean;
  card_payment: boolean;
  card_payment_method: string;
}

export interface CreateOrderResponse {
  included: CartItemSnapshot[];
  excluded: { item: CartItemSnapshot; message: string }[];
  order_id: string | null;
  order_status: string | null;
  client_secret: string | null;
}

export interface Order {
  _id?: string;
  code?: string;
  user_id: string;
  interval: string;
  items: CartItemSnapshot[];
  total: number;
  status: string;
  cash_payment: boolean;
  card_payment: boolean;
  card_payment_intent: string;
  created_at: string;
}

// --------------------------------------------------------------------------
// Helpers

export const isCreateOrderResponse = (
  response: any
): response is CreateOrderResponse => {
  const unsafeCast = response as CreateOrderResponse;

  return (
    unsafeCast.included !== undefined &&
    unsafeCast.excluded !== undefined &&
    unsafeCast.order_id !== undefined &&
    unsafeCast.order_status !== undefined &&
    unsafeCast.client_secret !== undefined
  );
};

export const isOrder = (order: any): order is Order => {
  const unsafeCast = order as Order;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.code !== undefined &&
    unsafeCast.user_id !== undefined &&
    unsafeCast.interval !== undefined &&
    unsafeCast.items !== undefined &&
    unsafeCast.total !== undefined &&
    unsafeCast.status !== undefined &&
    unsafeCast.card_payment !== undefined &&
    unsafeCast.card_payment !== undefined &&
    unsafeCast.card_payment_intent !== undefined &&
    unsafeCast.created_at !== undefined
  );
};

export const areOrders = (orders: any[]): orders is Order[] => {
  const areOrders = orders.reduce((acc, curr) => {
    if (isOrder(curr)) {
      return acc * 1;
    } else {
      return acc * 0;
    }
  }, 1);

  return areOrders === 1;
};

export const statusToPct = (status: string): number => {
  if (status === "submitted") {
    return 40;
  }

  if (status === "accepted") {
    return 60;
  }

  if (status === "ready" || status === "stalled") {
    return 80;
  }

  if (status === "completed") {
    return 100;
  }

  return 0;
};

export const formatStatus = (status: string): string => {
  if (status === "submitted") {
    return "Inviato";
  }

  if (status === "accepted") {
    return "Accettato";
  }

  if (status === "ready") {
    return "Pronto";
  }

  if (status === "completed") {
    return "Completato";
  }

  if (status === "stalled") {
    return "Fermo";
  }

  if (status === "refunded") {
    return "Rimborsato";
  }

  if (status === "rejected") {
    return "Rifiutato";
  }

  return "";
};

export const statusToColor = (status: string): string => {
  if (status === "submitted") {
    return "#F6D22D";
  }

  if (status === "accepted") {
    return "#00AD0A";
  }

  if (status === "ready") {
    return "#00AD0A";
  }

  if (status === "completed") {
    return "#00AD0A";
  }

  if (status === "stalled") {
    return "#FFAA00";
  }

  if (status === "refunded") {
    return "#343537";
  }

  if (status === "rejected") {
    return "#FF465C";
  }

  return "";
};
