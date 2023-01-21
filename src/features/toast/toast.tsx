import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import {
  selectToastState,
  setToastState,
} from "../../app/store-slices/app-slice";

import "./toast.css";

import ReactPortal from "../reactPortal/reactPortal";
import { AnimatePresence, motion } from "framer-motion";

import { ReactComponent as ToastInfoIcon } from "../../assets/toast-info@24px.svg";

const Toast: React.FC = () => {
  const state = useSelector(selectToastState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (state.isOpen) {
      var timeout = setTimeout(() => {
        dispatch(setToastState({ isOpen: false, message: "" }));
      }, 3000); // 3s
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [state, dispatch]);

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
