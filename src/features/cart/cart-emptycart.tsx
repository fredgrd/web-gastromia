import React from "react";
import "./cart-emptycart.css";

import CartIcon from "../../assets/images/grocery.png";

const EmptyCart: React.FC = () => {
  return (
    <div className="cart-cartitems-empty-content">
      <img className="cart-cartitems-empty-img" src={CartIcon} />
      <span className="cart-cartitems-empty-title">
        Il tuo carrello è vuoto
      </span>
    </div>
  );
};

export default EmptyCart;
