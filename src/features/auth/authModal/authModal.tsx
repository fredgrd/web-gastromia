import React, { useState, useEffect } from "react";
import "./authModal.css";

import ReactPortal from "../../reactPortal/reactPortal";
import NumberInput from "./numberInput";
import CodeInput from "./codeInput";
import NameInput from "./nameInput";
import Toast, { ToastState } from "../../toast/toast";

enum AuthStep {
  Number,
  Code,
  Name,
}

enum AuthModalState {
  Visible,
  Hidden,
}

const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [authModalState, setAuthModalState] = useState<AuthModalState>(
    AuthModalState.Visible
  );
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.Number);
  const [number, setNumber] = useState<string>("");
  const [toastState, setToastState] = useState<ToastState>({
    show: false,
    message: "",
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (authModalState === AuthModalState.Hidden) {
      timeout = setTimeout(() => {
        setAuthModalState(AuthModalState.Visible);
        setAuthStep(AuthStep.Number);
        onClose();
      }, 200);
    }

    return () => clearTimeout(timeout);
  }, [authModalState]);

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

  const renderSwitch = (step: AuthStep) => {
    switch (step) {
      case AuthStep.Number:
        return (
          <NumberInput
            onClose={() => setAuthModalState(AuthModalState.Hidden)}
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
        return (
          <NameInput onDone={() => setAuthModalState(AuthModalState.Hidden)} />
        );
    }
  };

  return (
    <ReactPortal wrapperId="portal">
      <div
        className={`auth-modal ${
          authModalState === AuthModalState.Visible
            ? "auth-modal-enter"
            : "auth-modal-exit"
        }`}
      >
        <div
          className={`auth-modal-content ${
            authModalState === AuthModalState.Visible
              ? "auth-modal-content-enter"
              : "auth-modal-content-exit"
          }`}
        >
          {renderSwitch(authStep)}
        </div>
      </div>

      {toastState.show && (
        <Toast
          message={toastState.message}
          duration={3000}
          onDone={() => {
            setToastState({ show: false, message: "" });
          }}
        />
      )}
    </ReactPortal>
  );
};

export default AuthModal;
