import React, { useState } from "react";
import MenuDrawer from "./menuDrawer";
import "./header.css";

import { ReactComponent as MenuIcon } from "../../assets/menu@24px.svg";
import { ReactComponent as GastromiaLogo } from "../../assets/gastromia-logo@24px.svg";
import { ReactComponent as CartIcon } from "../../assets/cart@24px.svg";
import { ReactComponent as SearchIcon } from "../../assets/search@20px.svg";
import AuthModal from "../auth/authModal/authModal";
import CartDrawer from "./cartDrawer";

const Header = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);

  return (
    <div className="header">
      <button className="header-menubtn" onClick={() => setShowMenu(true)}>
        <MenuIcon fill="#343538" />
      </button>
      <MenuDrawer
        isOpen={showMenu}
        onClose={() => {
          console.log("DRAWER HIDE");
          setShowMenu(false);
        }}
      />

      <button className="header-logobtn">
        <GastromiaLogo />
      </button>

      <button className="header-authbtn" onClick={() => setShowAuth(true)}>
        <span className="header-authbtn-title">Log in</span>
      </button>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      <button
        className="header-cartbtn"
        onClick={() => {
          setShowCart(true);
          console.log("clicked");
        }}
      >
        <CartIcon fill="#343538" />
        <span className="header-cartbtn-count">0</span>
      </button>
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />

      <button className="header-searchbtn">
        <span className="header-searchbtn-title">Ho voglia di...</span>
        <SearchIcon />
      </button>
    </div>
  );
};

export default Header;
