import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectToastState,
  setToastState,
} from "../../app/store-slices/app-slice";
import { motion } from "framer-motion";
import "./toast.css";

import ReactPortal from "../reactPortal/reactPortal";
import { ReactComponent as ToastInfoIcon } from "../../assets/toast-info@24px.svg";
import { AnimatePresence } from "framer-motion";

const Toast: React.FC = () => {
  const state = useSelector(selectToastState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state.isOpen) {
      var timeout = setTimeout(() => {
        dispatch(setToastState({ isOpen: false, message: "" }));
      }, 3000); // 3s
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  return (
    <ReactPortal wrapperId="portal">
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            className="toast-content"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "10px", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ToastInfoIcon className="toast-icon" />
            <div className="toast-body">
              <p className="toast-text">{state.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default Toast;
