import { CartItemAttributeSnapshot, CartItemSnapshot } from "./cart-snapshot";

// --------------------------------------------------------------------------
// Interface

export interface AttributeGroupRules {
  group_min: number;
  group_max: number;
  attribute_max: number;
}

export interface Attribute {
  _id: string;
  name: string;
  unique_tag: string;
  price: number;
  available: boolean;
  media_url: string;
}

export interface AttributeGroup {
  _id: string;
  with_media: boolean;
  rules: AttributeGroupRules;
  name: string;
  description: string;
  attributes: Attribute[];
}

export interface Item {
  _id: string;
  name: string;
  description: string;
  details: string;
  ingredients: string;
  available: boolean;
  quick_add: boolean;
  price: number;
  discount: boolean;
  discount_price: number;
  discount_label: string;
  attribute_groups: [AttributeGroup];
  tags: [string];
  category: string;
  media_url: string;
  preview_url: string;
}

// --------------------------------------------------------------------------
// Helpers

export const isItem = (item: any): item is Item => {
  const usanfeCast = item as Item;
  return (
    usanfeCast._id !== undefined &&
    usanfeCast.name !== undefined &&
    usanfeCast.description !== undefined &&
    usanfeCast.details !== undefined &&
    usanfeCast.ingredients !== undefined &&
    usanfeCast.available !== undefined &&
    usanfeCast.quick_add !== undefined &&
    usanfeCast.price !== undefined &&
    usanfeCast.discount !== undefined &&
    usanfeCast.discount_price !== undefined &&
    usanfeCast.discount_label !== undefined &&
    usanfeCast.attribute_groups !== undefined &&
    usanfeCast.tags !== undefined &&
    usanfeCast.category !== undefined &&
    usanfeCast.media_url !== undefined &&
    usanfeCast.preview_url !== undefined
  );
};

export const isItems = (items: [any]): items is [Item] => {
  const areItems = items.reduce((acc, curr) => {
    if (isItem(curr)) {
      return acc * 1;
    } else {
      return acc * 0;
    }
  }, 1);

  return areItems === 1;
};

export const parseAttributeIntoSnapshot = (
  attribute: Attribute,
  groupId: string
): CartItemAttributeSnapshot => {
  return {
    group_id: groupId,
    attribute_id: attribute._id,
    name: attribute.name,
    quantity: 0,
    price: attribute.price,
  };
};

export const parseAttributeGroupsIntoMap = (
  groups: AttributeGroup[]
): Map<string, Map<string, CartItemAttributeSnapshot>> => {
  const map = new Map<string, Map<string, CartItemAttributeSnapshot>>([]);

  groups.forEach((group) => {
    map.set(group._id, new Map<string, CartItemAttributeSnapshot>([]));

    group.attributes.forEach((attribute) => {
      map
        .get(group._id)
        ?.set(attribute._id, parseAttributeIntoSnapshot(attribute, group._id));
    });
  });

  return map;
};

export const parseItemIntoSnapshot = (item: Item): CartItemSnapshot => {
  const snapshot: CartItemSnapshot = {
    item_id: item._id,
    name: item.name,
    preview_url: item.preview_url,
    attributes_snapshot: [],
    quantity: 1,
    price: item.discount ? item.discount_price : item.price,
  };

  return snapshot;
};
