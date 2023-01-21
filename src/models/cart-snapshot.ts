export interface CartItemAttributeSnapshot {
  group_id: string;
  attribute_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CartItemSnapshot {
  _id?: string | undefined;
  item_id: string;
  name: string;
  preview_url: string;
  attributes_snapshot: CartItemAttributeSnapshot[];
  quantity: number;
  price: number;
}

export interface CartSnapshot {
  update_snapshot: Boolean;
  included: CartItemSnapshot[];
  excluded: {
    item: CartItemSnapshot;
    message: string;
  }[];
}

export const isCartSnapshot = (snapshot: any): snapshot is CartSnapshot => {
  const unsafeCast = snapshot as CartSnapshot;

  return (
    unsafeCast &&
    unsafeCast.update_snapshot !== undefined &&
    unsafeCast.included !== undefined &&
    unsafeCast.excluded !== undefined
  );
};

/// Equates two instances of a CartItemSnapshot
//// The attributes are transformed into a group_id + attribute_id + quantity string.
//// The attributes are then joined together to form a unique string
//// If the two strings and the item ids match then it is the same item
//// ASSUMES that the attributes are always added following the same order.
export const equate = (
  lhs: CartItemSnapshot,
  rhs: CartItemSnapshot
): boolean => {
  if (lhs.item_id !== rhs.item_id) {
    return false;
  }

  // Equate attributes
  const lhsAttributes = lhs.attributes_snapshot
    .map((e) => `${e.group_id}_${e.attribute_id}_${e.quantity}`)
    .join("+");
  const rhsAttributes = rhs.attributes_snapshot
    .map((e) => `${e.group_id}_${e.attribute_id}_${e.quantity}`)
    .join("+");

  return lhsAttributes === rhsAttributes;
};
