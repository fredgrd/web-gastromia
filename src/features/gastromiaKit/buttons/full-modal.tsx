import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactPortal from "../../reactPortal/reactPortal";
import "./full-modal.css";

import { ReactComponent as Close } from "../../../assets/close@20px.svg";

const FullModal: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  options: {
    heading: string;
  };
}> = ({ children, isOpen, onClose, options }) => {
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
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fullmodal"
          >
            <div className="fullmodal-header">
              <div className="fullmodal-icon">
                <button className="icon-btn" onClick={onClose}>
                  <Close />
                </button>
              </div>
              <h2 className="fullmodal-heading">{options.heading}</h2>
            </div>
            <div className="fullmodal-content">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default FullModal;
