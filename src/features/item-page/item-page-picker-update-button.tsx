import React from "react";
import "./item-page-picker-update-button.css";

import { ReactComponent as MinusIcon } from "../../assets/minus@22px.svg";
import { ReactComponent as TrashIcon } from "../../assets/trash@22px.svg";
import { ReactComponent as PlusIcon } from "../../assets/plus@22px.svg";

const ItemPickerUpdateButton: React.FC<{
  count: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onUpdate: () => void;
}> = ({ count, quantity, onIncrease, onDecrease, onUpdate }) => {
  return (
    <div className="itempagepickerupdatebutton-content">
      <div className="itempagepickerupdatebutton-quantity-content">
        <button
          className="itempagepickerupdatebutton-quantity-removebtn"
          disabled={count === 0}
          onClick={onDecrease}
        >
          {count <= 1 ? (
            <TrashIcon fill={count > 0 ? "#343537" : "#C7C8CD"} />
          ) : (
            <MinusIcon fill="#343537" />
          )}
        </button>
        <span className="itempagepickerupdatebutton-quantity-count">{count}</span>
        <button
          className="itempagepickerupdatebutton-quantity-addbtn"
          onClick={onIncrease}
        >
          <PlusIcon fill="#343537" />
        </button>
      </div>
      <button
        className={
          count === quantity
            ? "itempagepickerupdatebutton-cart-incartbtn"
            : "itempagepickerupdatebutton-cart-addbtn"
        }
        disabled={count === quantity}
        onClick={onUpdate}
      >
        <span
          className="itempagepickerupdatebutton-cart-addbtn-title"
          style={{
            color: count === quantity ? "#c7c8cd" : "white",
          }}
        >
          {count === quantity ? "Aggiunto" : "Aggiorna"}
        </span>
      </button>
    </div>
  );
};

export default ItemPickerUpdateButton;
