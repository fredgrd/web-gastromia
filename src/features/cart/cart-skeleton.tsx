import React from "react";
import Skeleton from "../skeleton/skeleton";
import "./cart-skeleton.css";

const CartItemSkeleton: React.FC = () => {
  return (
    <div className="cart-skeleton-cartitem-content">
      <div className="cart-skeleton-cartitem-lvl1">
        <Skeleton className="cart-skeleton-cartitem-lvl1-img" />
        <Skeleton className="cart-skeleton-cartitem-lvl1-name" />
        <Skeleton className="cart-skeleton-cartitem-lvl1-price" />
      </div>
      <Skeleton className="cart-skeleton-cartitem-lvl2" />
      <Skeleton className="cart-skeleton-cartitem-lvl3" />
    </div>
  );
};

const CartSkeleton: React.FC = () => {
  return (
    <div className="cart-skeleton-content">
      <CartItemSkeleton />
      <CartItemSkeleton />
      <CartItemSkeleton />
    </div>
  );
};

export default CartSkeleton;
