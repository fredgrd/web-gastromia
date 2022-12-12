import React, { useState } from "react";
import MenuDrawer from "./menuDrawer";
import "./header.css";

import { ReactComponent as MenuIcon } from "../../assets/menu@24px.svg";

const Header = () => {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  return (
    <div className="header">
      <button
        className="header-menubtn"
        onClick={() => {
          setShowDrawer(true);
          console.log("clicked");
        }}
      >
        <MenuIcon fill="#343538" />
      </button>
      <MenuDrawer show={showDrawer} onClose={() => setShowDrawer(false)} />

      <button
        className="header-authbtn"
        onClick={() => {
          setShowDrawer(true);
          console.log("clicked");
        }}
      >
        <span className="header-authbtn-title">Log in</span>
      </button>

      <button
        className="header-cartbtn"
        onClick={() => {
          setShowDrawer(true);
          console.log("clicked");
        }}
      >
        <MenuIcon fill="#343538" />
      </button>
    </div>
  );
};

export default Header;
