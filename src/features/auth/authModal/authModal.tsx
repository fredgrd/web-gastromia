import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthModalState,
  setAuthModalState,
} from "../../../app/store-slices/app-slice";
import { AnimatePresence, motion } from "framer-motion";
import ReactPortal from "../../reactPortal/reactPortal";
import NumberInput from "./numberInput";
import CodeInput from "./codeInput";
import NameInput from "./nameInput";
import "./authModal.css";

enum AuthStep {
  Number,
  Code,
  Name,
}

const AuthModal: React.FC = () => {
  const isOpen = useSelector(selectAuthModalState);
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.Number);
  const [number, setNumber] = useState<string>("");
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isOpen]);

  const onClose = () => {
    dispatch(setAuthModalState({ isOpen: false }));
  };

  const renderSwitch = (step: AuthStep) => {
    switch (step) {
      case AuthStep.Number:
        return (
          <NumberInput
            onClose={onClose}
            onDone={(number) => {
              setNumber(number);
              setAuthStep(AuthStep.Code);
            }}
          />
        );
      case AuthStep.Code:
        return (
          <CodeInput
            number={number}
            onClose={() => setAuthStep(AuthStep.Number)}
            onDone={onClose}
            onNext={() => setAuthStep(AuthStep.Name)}
          />
        );
      case AuthStep.Name:
        return <NameInput onDone={onClose} />;
    }
  };

  return (
    <ReactPortal wrapperId="portal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="auth-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="auth-modal-content"
              initial={{ y: "100%" }}
              animate={{ y: "20px" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderSwitch(authStep)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default AuthModal;
