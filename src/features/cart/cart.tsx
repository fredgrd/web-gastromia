import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCart,
  selectIsFetchingSnapshot,
  selectIsUpdatingSnapshot,
} from "../../app/store-slices/cart-slice";
import { AppDispatch } from "../../app/store";
import CartSkeleton from "./cart-skeleton";
import "./cart.css";

import { ReactComponent as CloseIcon } from "../../assets/cross@24px.svg";
import CartItem from "./cart-item";
import EmptyCart from "./cart-emptycart";

const Cart: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isFetchingSnapshot = useSelector(selectIsFetchingSnapshot);
  const isUpdatingSnapshot = useSelector(selectIsUpdatingSnapshot);
  const cartItems = useSelector(selectCart);

  // Fetch an independet copy of the snapshot

  return (
    <div className="cart">
      <div className="cart-header">
        <button className="cart-header-closebtn" onClick={onClose}>
          <CloseIcon fill="#343538" />
        </button>
        <div className="cart-header-heading-content">
          <span className="cart-header-heading-title">Carrello</span>
          <span className="cart-header-heading-subtitle">
            Gastromia Ostiense
          </span>
        </div>
      </div>
      {isFetchingSnapshot ? (
        <CartSkeleton />
      ) : (
        <div className="cart-cartitems-content">
          {cartItems.length ? (
            cartItems.map((item, idx) => (
              <CartItem item={item} key={`${item._id} + ${idx}`} />
            ))
          ) : (
            <EmptyCart />
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
