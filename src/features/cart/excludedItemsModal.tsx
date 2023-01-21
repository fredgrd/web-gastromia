import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateExcluded,
  selectExcluded,
} from "../../app/store-slices/cart-slice";
import ReactPortal from "../reactPortal/reactPortal";
import { AnimatePresence, motion } from "framer-motion";
import "./excludedItemsModal.css";

import Grocery from "../../assets/images/grocery.png";
import useClickOutside from "../../utils/useClickOutside";

const ExcludedItemsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const excludedItems = useSelector(selectExcluded);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (excludedItems.length) {
      setIsOpen(true);
    }
  }, [excludedItems]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isOpen]);

  const onClose = () => {
    dispatch(updateExcluded({ excluded: [] }));
    setIsOpen(false);
    window.location.reload(); // Reload to update the current view?
  };

  useClickOutside(drawerRef, onClose);

  return (
    <ReactPortal wrapperId="portal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="excludeditems-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="excludeditems-modal-content"
              ref={drawerRef}
              initial={{ y: "100%" }}
              animate={{ y: "calc(100% - 450px)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="excludeditems-modal-header">
                <img className="excludeditems-modal-header-img" src={Grocery} />
                <h2 className="excludeditems-modal-header-heading">
                  Aggiornamento carrello
                </h2>
                <span className="excludeditems-modal-header-subheading">
                  Abbiamo rimosso alcuni prodotti dal tuo carrello:
                </span>
              </div>

              <div className="excludeditems-modal-itemslist-content">
                {excludedItems.map((excludedItem, idx) => (
                  <div className="excludeditems-modal-item-content" key={idx}>
                    <img
                      className="excludeditems-modal-item-img"
                      src={excludedItem.item.preview_url}
                    />
                    <div className="excludeditems-modal-item-info">
                      <span className="excludeditems-modal-item-name">
                        {excludedItem.item.name}
                      </span>
                      <span className="excludeditems-modal-item-message">
                        {excludedItem.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="excludeditems-modal-continuebtn-content">
                <button className="main-btn" onClick={onClose}>
                  Ok
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default ExcludedItemsModal;
