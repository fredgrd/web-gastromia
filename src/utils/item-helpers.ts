import { CartItemAttributeSnapshot } from "../models/cart-snapshot";

export const countAttributes = (
  groups: Map<string, Map<string, CartItemAttributeSnapshot>>
): number => {
  let count = 0;
  groups.forEach((value, _) => {
    value.forEach((attribute, _) => {
      count += attribute.quantity;
    });
  });

  return count;
};

export const computeTotal = (
  itemPrice: number,
  itemQuantity: number,
  attributeSnapshots: Map<string, Map<string, CartItemAttributeSnapshot>>
): number => {
  let total = itemPrice;
  attributeSnapshots.forEach((group) => {
    group.forEach((attribute) => {
      total += attribute.price * attribute.quantity;
    });
  });

  return total * itemQuantity;
};
