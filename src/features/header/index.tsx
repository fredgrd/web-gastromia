import React from "react";
import { DrawerIcon } from "../icons/drawerIcon";
import "./header.css";

const Header = () => {
  return (
    <div className="header">
      <button className="header-drawerbtn">
        <span className="header-drawerbtn-icnbox">
          <DrawerIcon selected={true} />
        </span>
      </button>
      <div className="headercartbutton"></div>
    </div>
  );
};

export default Header;
