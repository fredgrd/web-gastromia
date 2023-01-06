import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useClickOutside from "../../utils/useClickOutside";
import ReactPortal from "../reactPortal/reactPortal";
import "./cartDrawer.css";

enum DrawerState {
  Visible,
  Hidden,
}

const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [drawerState, setDrawerState] = useState<DrawerState>(
    DrawerState.Visible
  );
  const drawerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [firstLocation, setFirstLocation] = useState<string>("/");

  useEffect(() => {
    if (isOpen) {
      setFirstLocation(location.pathname);
    }
  }, [isOpen]);

  useEffect(() => {
    if (firstLocation !== location.pathname) {
      onClose();
    }
  }, [location]);

  useClickOutside(drawerRef, () => setDrawerState(DrawerState.Hidden));

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (drawerState === DrawerState.Hidden) {
      timeout = setTimeout(() => {
        setDrawerState(DrawerState.Visible);
        onClose();
      }, 200);
    }

    return () => clearTimeout(timeout);
  }, [drawerState]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ReactPortal wrapperId="portal">
      <div
        id="cartdrawer"
        className={`cartdrawer ${
          drawerState === DrawerState.Visible
            ? "cartdrawer-enter"
            : "cartdrawer-exit"
        }`}
      >
        <div
          className={`cartdrawer-content ${
            drawerState === DrawerState.Visible
              ? "cartdrawer-content-enter"
              : "cartdrawer-content-exit"
          }`}
          ref={drawerRef}
        ></div>
      </div>
    </ReactPortal>
  );
};

export default CartDrawer;
