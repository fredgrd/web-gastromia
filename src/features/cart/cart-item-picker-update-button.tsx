import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  updateOne,
  updateRemoteSnapshot,
} from "../../app/store-slices/cart-slice";
import useClickOutside from "../../utils/useClickOutside";
import "./cart-item-picker-update-button.css";

import { ReactComponent as PlusIcon } from "../../assets/plus@22px.svg";
import { ReactComponent as TrashIcon } from "../../assets/trash@22px.svg";
import { ReactComponent as MinusIcon } from "../../assets/minus@22px.svg";
import { CartItemSnapshot } from "../../models/cart-snapshot";

const CartItemPickerUpdateButton: React.FC<{ item: CartItemSnapshot }> = ({
  item,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(item.quantity);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useClickOutside(buttonRef, () => setIsOpen(false));

  useEffect(() => {
    if (count === item.quantity) {
      return;
    }

    onUpdate();
  }, [count]);

  const onUpdate = () => {
    if (!item) {
      return;
    }

    /// Update snapshot
    const updatedItem: CartItemSnapshot = { ...item, quantity: count };

    dispatch(updateOne({ item: updatedItem }));
    dispatch(updateRemoteSnapshot());
  };

  return (
    <div className="cart-cartitem-pickerupdatebtn-content">
      <div
        className="cart-cartitem-pickerupdatebtn-quantity-content"
        onClick={() => setIsOpen(true)}
      >
        <span className="cart-cartitem-pickerupdatebtn-quantity">
          {item.quantity}
        </span>
      </div>

      {isOpen ? (
        <div
          className="cart-cartitem-pickerupdatebtn-btn-content"
          ref={buttonRef}
        >
          <button
            className="cart-cartitem-pickerupdatebtn-btn-decrease"
            onClick={() => setCount((prev) => prev - 1)}
          >
            {count > 1 ? (
              <MinusIcon fill="#343538" style={{ marginLeft: "3px" }} />
            ) : (
              <TrashIcon fill="#343538" style={{ marginLeft: "3px" }} />
            )}
          </button>
          <span className="cart-cartitem-pickerupdatebtn-btn-quantity">
            {count}
          </span>
          <button
            className="cart-cartitem-pickerupdatebtn-btn-increase"
            onClick={() => setCount((prev) => prev + 1)}
          >
            <PlusIcon fill="#343538" style={{ marginRight: "3px" }} />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default CartItemPickerUpdateButton;
