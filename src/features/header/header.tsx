import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/store-slices/auth-slice";
import { selectCartCount } from "../../app/store-slices/cart-slice";
import MenuDrawer from "./menuDrawer";
import "./header.css";

import { ReactComponent as MenuIcon } from "../../assets/menu@24px.svg";
import { ReactComponent as GastromiaLogo } from "../../assets/gastromia-logo@24px.svg";
import { ReactComponent as CartIcon } from "../../assets/cart@24px.svg";
import { ReactComponent as SearchIcon } from "../../assets/search@20px.svg";
import AuthModal from "../auth/authModal/authModal";
import CartDrawer from "./cartDrawer";
import SearchModal from "../search/search-modal";

const Header = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const user = useSelector(selectCurrentUser);
  const cartCount = useSelector(selectCartCount);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="header">
      <button className="header-menubtn" onClick={() => setShowMenu(true)}>
        <MenuIcon fill="#343538" />
      </button>
      <MenuDrawer
        isOpen={showMenu}
        onClose={() => {
          setShowMenu(false);
        }}
      />

      <button className="header-logobtn" onClick={() => navigate("/")}>
        <GastromiaLogo />
      </button>

      {user === null ? (
        <button className="header-authbtn" onClick={() => setShowAuth(true)}>
          <span className="header-authbtn-title">Log in</span>
        </button>
      ) : null}

      <button
        className="header-cartbtn"
        onClick={() => setShowCart(true)}
        style={{
          backgroundColor: location.pathname === "/" ? "#f6f7f8" : "#00ad0a",
        }}
      >
        <CartIcon fill={location.pathname === "/" ? "#343538" : "white"} />
        <span
          className="header-cartbtn-count"
          style={{
            color: location.pathname === "/" ? "#343538" : "white",
          }}
        >
          {cartCount}
        </span>
      </button>
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />

      <button className="header-searchbtn" onClick={() => setShowSearch(true)}>
        <span className="header-searchbtn-title">Ho voglia di...</span>
        <SearchIcon />
      </button>
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  );
};

export default Header;
