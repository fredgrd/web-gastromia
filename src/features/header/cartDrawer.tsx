import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCartCount,
  selectCartTotal,
  selectIsUpdatingSnapshot,
} from "../../app/store-slices/cart-slice";
import useClickOutside from "../../utils/useClickOutside";
import ReactPortal from "../reactPortal/reactPortal";
import { AnimatePresence, motion } from "framer-motion";
import Cart from "../cart/cart";
import { Player } from "@lottiefiles/react-lottie-player";
import SpinnerJSON from "../../assets/spinner-animation-white.json";
import "./cartDrawer.css";

const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [firstLocation, setFirstLocation] = useState<string>("/");
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);
  const isUpdatingSnapshot = useSelector(selectIsUpdatingSnapshot);
  const navigate = useNavigate();

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

  useClickOutside(drawerRef, onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isOpen]);

  return (
    <ReactPortal wrapperId="portal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="cartdrawer"
            className="cartdrawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="cartdrawer-content"
              initial={{ x: "100%" }}
              animate={{ x: "0px" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2 }}
              ref={drawerRef}
            >
              <Cart onClose={onClose} />

              {cartCount > 0 ? (
                <div className="cartdrawer-checkoutbtn-content">
                  <button
                    className="cartdrawer-checkoutbtn"
                    onClick={() => {
                      onClose();
                      navigate("/checkout");
                    }}
                    disabled={isUpdatingSnapshot}
                  >
                    {isUpdatingSnapshot ? (
                      <Player
                        autoplay={true}
                        loop={true}
                        src={SpinnerJSON}
                        style={{ height: "40px", width: "40px" }}
                      ></Player>
                    ) : (
                      <React.Fragment>
                        <span className="cartdrawer-checkoutbtn-title">
                          Vai al checkout
                        </span>
                        <div className="cartdrawer-checkoutbtn-total-content">
                          <span className="cartdrawer-checkoutbtn-total">
                            €{(cartTotal / 1000).toFixed(2)}
                          </span>
                        </div>
                      </React.Fragment>
                    )}
                  </button>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default CartDrawer;
