import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { selectCurrentUser } from "../../app/store-slices/auth-slice";
import { setAuthModalState } from "../../app/store-slices/app-slice";
import {
  selectItemQuantityByItemId,
  updateRemoteSnapshot,
  updateOne,
} from "../../app/store-slices/cart-slice";
import { Item } from "../../models/item";
import useClickOutside from "../../utils/useClickOutside";
import "./item-card-picker-add-button.css";

import { ReactComponent as PlusIcon } from "../../assets/plus@22px.svg";
import { ReactComponent as TrashIcon } from "../../assets/trash@22px.svg";
import { ReactComponent as MinusIcon } from "../../assets/minus@22px.svg";

const ItemCardPickerAddButton: React.FC<{ item: Item }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const quantity = useSelector((state: RootState) =>
    selectItemQuantityByItemId(state, item._id)
  );
  const user = useSelector(selectCurrentUser);

  useClickOutside(buttonRef, () => setIsOpen(false));

  const onAdd = () => {
    if (!user) {
      dispatch(setAuthModalState({ isOpen: true }));
      return;
    }

    setIsOpen(true);
    dispatch(
      updateOne({
        item: {
          item_id: item._id,
          name: item.name,
          preview_url: item.preview_url,
          attributes_snapshot: [],
          quantity: quantity + 1,
          price: item.discount ? item.discount_price : item.price,
        },
      })
    );
    dispatch(updateRemoteSnapshot());
  };

  const removeOnClick = () => {
    if (!user) {
      dispatch(setAuthModalState({ isOpen: true }));
      return;
    }

    // Close the extension if removed from cart
    if (quantity === 1) {
      setIsOpen(false);
    }

    dispatch(
      updateOne({
        item: {
          item_id: item._id,
          name: item.name,
          preview_url: item.preview_url,
          attributes_snapshot: [],
          quantity: quantity > 1 ? quantity - 1 : 0,
          price: item.discount ? item.discount_price : item.price,
        },
      })
    );
    dispatch(updateRemoteSnapshot());
  };

  return (
    <div className="itemcardpickeraddbutton-content" ref={buttonRef}>
      {isOpen ? (
        <div className="itemcardpickeraddbutton-extended-content">
          <button
            className="itemcardpickeraddbutton-extended-removebtn"
            onClick={removeOnClick}
          >
            {quantity > 1 ? (
              <MinusIcon fill="white" style={{ marginLeft: "3px" }} />
            ) : (
              <TrashIcon fill="white" style={{ marginLeft: "3px" }} />
            )}
          </button>
          <span className="itemcardpickeraddbutton-extended-count">
            {quantity}
          </span>
          <button
            className="itemcardpickeraddbutton-extended-addbtn"
            onClick={onAdd}
          >
            <PlusIcon fill="white" style={{ marginRight: "3px" }} />
          </button>
        </div>
      ) : (
        <button
          className="itemcardpickeraddbutton-previewbtn"
          onClick={() => {
            if (quantity === 0) {
              onAdd();
            } else {
              setIsOpen(true);
            }
          }}
        >
          {quantity > 0 ? (
            <span className="itemcardpickeraddbutton-count">{quantity}</span>
          ) : (
            <PlusIcon fill="white" />
          )}
        </button>
      )}
    </div>
  );
};

export default ItemCardPickerAddButton;
