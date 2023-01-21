import { group } from "console";
import { createContext } from "react";
import { CartItemAttributeSnapshot } from "../../models/cart-snapshot";
import { AttributeGroup, AttributeGroupRules } from "../../models/item";

export interface ItemPageState {
  attributeSnapshots: Map<string, Map<string, CartItemAttributeSnapshot>>;
  updateContext: (state: ItemPageState) => void;
}

const Context = createContext<ItemPageState>({
  attributeSnapshots: new Map([]),
  updateContext: () => {},
});

export default Context;

export const handleSelect = (
  attributeSnapshots: Map<string, Map<string, CartItemAttributeSnapshot>>,
  groupSnapshot: Map<string, CartItemAttributeSnapshot>,
  attributeSnapshot: CartItemAttributeSnapshot,
  groupID: string,
  attributeID: string,
  rules: AttributeGroupRules
): Map<string, Map<string, CartItemAttributeSnapshot>> => {
  // Select one
  if (rules.group_max === 1) {
    const map: Map<string, CartItemAttributeSnapshot> = new Map([]);
    attributeSnapshots.get(groupID)!.forEach((value) => {
      map.set(value.attribute_id, {
        ...value,
        quantity: attributeID === value.attribute_id ? 1 : 0,
      });
    });

    attributeSnapshots.set(groupID, map);
  }

  // Select many
  if (rules.group_max > 1 && rules.attribute_max === 1) {
    let total = 0;
    groupSnapshot.forEach((value, _) => {
      total += value.quantity;
    });

    if (attributeSnapshot.quantity === 0 && total < rules.group_max) {
      attributeSnapshots
        .get(groupID)!
        .set(attributeID, { ...attributeSnapshot, quantity: 1 });
    }

    if (attributeSnapshot.quantity > 0) {
      attributeSnapshots
        .get(groupID)!
        .set(attributeID, { ...attributeSnapshot, quantity: 0 });
    }
  }

  return attributeSnapshots;
};

export const handleAdd = (
  attributeSnapshots: Map<string, Map<string, CartItemAttributeSnapshot>>,
  groupSnapshot: Map<string, CartItemAttributeSnapshot>,
  attributeSnapshot: CartItemAttributeSnapshot,
  groupID: string,
  attributeID: string,
  rules: AttributeGroupRules
): Map<string, Map<string, CartItemAttributeSnapshot>> => {
  let total = 0;
  groupSnapshot.forEach((value, _) => {
    total += value.quantity;
  });

  if (
    total < rules.group_max &&
    attributeSnapshot.quantity < rules.attribute_max
  ) {
    attributeSnapshots.get(groupID)!.set(attributeID, {
      ...attributeSnapshot,
      quantity: attributeSnapshot.quantity + 1,
    });
  }

  return attributeSnapshots;
};

export const handleRemove = (
  attributeSnapshots: Map<string, Map<string, CartItemAttributeSnapshot>>,
  groupSnapshot: Map<string, CartItemAttributeSnapshot>,
  attributeSnapshot: CartItemAttributeSnapshot,
  groupID: string,
  attributeID: string,
  rules: AttributeGroupRules
): Map<string, Map<string, CartItemAttributeSnapshot>> => {
  if (attributeSnapshot.quantity > 0) {
    attributeSnapshots.get(groupID)!.set(attributeID, {
      ...attributeSnapshot,
      quantity: attributeSnapshot.quantity - 1,
    });
  }

  return attributeSnapshots;
};

export const validateGroupConditions = (
  attributeSnapshots: Map<string, Map<string, CartItemAttributeSnapshot>>,
  groups: AttributeGroup[]
): {
  valid: boolean;
  groupID: string | undefined;
  groupName: string | undefined;
} => {
  for (const [key, snapMap] of Array.from(attributeSnapshots.entries())) {
    const group = groups.find((e) => e._id === key);
    const rules = group?.rules;

    if (!group || !rules || rules.group_min === 0) {
      continue;
    }

    let total = 0;
    snapMap.forEach((value, _) => {
      total += value.quantity;
    });

    if (rules.group_min > total) {
      return { valid: false, groupID: key, groupName: group.name };
    }
  }

  return { valid: true, groupID: undefined, groupName: undefined };
};
