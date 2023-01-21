import React from "react";
import "./item-page-picker-add-button.css";

import { ReactComponent as MinusIcon } from "../../assets/minus@22px.svg";
import { ReactComponent as PlusIcon } from "../../assets/plus@22px.svg";

const ItemPickerAddButton: React.FC<{
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAdd: () => void;
}> = ({ count, onIncrease, onDecrease, onAdd }) => {
  return (
    <div className="itempagepickeraddbutton-content">
      <div className="itempagepickeraddbutton-quantity-content">
        <button
          className="itempagepickeraddbutton-quantity-removebtn"
          disabled={count === 1}
          onClick={onDecrease}
        >
          <MinusIcon fill={count > 1 ? "#343537" : "#C7C8CD"} />
        </button>
        <span className="itempagepickeraddbutton-quantity-count">{count}</span>
        <button
          className="itempagepickeraddbutton-quantity-addbtn"
          onClick={onIncrease}
        >
          <PlusIcon fill="#343537" />
        </button>
      </div>
      <button className="itempagepickeraddbutton-cart-addbtn" onClick={onAdd}>
        <span
          className="itempagepickeraddbutton-cart-addbtn-title"
          style={{
            color: "white",
          }}
        >
          Aggiungi
        </span>
      </button>
    </div>
  );
};

export default ItemPickerAddButton;
