import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  updateOne,
  updateRemoteSnapshot,
} from "../../app/store-slices/cart-slice";
import {
  CartItemAttributeSnapshot,
  CartItemSnapshot,
} from "../../models/cart-snapshot";
import CartItemPickerUpdateButton from "./cart-item-picker-update-button";
import "./cart-item.css";

import { ReactComponent as TrashIcon } from "../../assets/trash@18px.svg";

const CartItemAttribute: React.FC<{ attribute: CartItemAttributeSnapshot }> = ({
  attribute,
}) => {
  return (
    <div className="cart-cartitem-attribute">
      <span className="cart-cartitem-attribute-name">{`${attribute.name} ${
        attribute.quantity > 1 ? `x${attribute.quantity}` : ""
      }`}</span>
    </div>
  );
};

const CartItem: React.FC<{ item: CartItemSnapshot }> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const attributesTot = item.attributes_snapshot.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );

  return (
    <div className="cart-cartitem-content">
      <div className="cart-cartitem-header-content">
        <img className="cart-cartitem-header-img" src={item.preview_url} />
        <span className="cart-cartitem-header-name">{item.name}</span>
        <CartItemPickerUpdateButton item={item} />
        <span className="cart-cartitem-header-price">
          €{(((item.price + attributesTot) * item.quantity) / 1000).toFixed(2)}
        </span>
      </div>

      <div className="cart-cartitem-attributes-content">
        {item.attributes_snapshot.map((attribute) => (
          <CartItemAttribute
            attribute={attribute}
            key={item._id + attribute.group_id + attribute.attribute_id}
          />
        ))}
      </div>

      <div style={{ marginTop: item.attributes_snapshot.length ? "16px" : "" }}>
        <button
          className="cart-cartitem-removebtn"
          onClick={() => {
            const updatedItem: CartItemSnapshot = { ...item, quantity: 0 };

            dispatch(updateOne({ item: updatedItem }));
            dispatch(updateRemoteSnapshot());
          }}
        >
          <TrashIcon fill="#343538" />
          <span className="cart-cartitem-removebtn-title">Rimuovi</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
