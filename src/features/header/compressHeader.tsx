import React, { useState } from "react";
import MenuDrawer from "./menuDrawer";
import "./compressHeader.css";

import { ReactComponent as MenuIcon } from "../../assets/menu@24px.svg";
import { ReactComponent as CartIcon } from "../../assets/cart@24px.svg";
import { ReactComponent as SearchIcon } from "../../assets/search@20px.svg";
import CartDrawer from "./cartDrawer";
import SearchModal from "../search/searchModal";

const CompressHeader = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  return (
    <div className="compressheader">
      <button
        className="compressheader-menubtn"
        onClick={() => setShowMenu(true)}
      >
        <MenuIcon fill="#343538" />
      </button>
      <MenuDrawer isOpen={showMenu} onClose={() => setShowMenu(false)} />

      <button
        className="compressheader-cartbtn"
        onClick={() => setShowCart(true)}
      >
        <CartIcon fill="#343538" />
        <span className="compressheader-cartbtn-count">0</span>
      </button>
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />

      <button
        className="compressheader-searchbtn"
        onClick={() => setShowSearch(true)}
      >
        <span className="compressheader-searchbtn-title">Ho voglia di...</span>
        <SearchIcon />
      </button>
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  );
};

export default CompressHeader;
