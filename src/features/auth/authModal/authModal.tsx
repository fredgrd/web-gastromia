import React, { FC, useState } from "react";
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

const AuthModal: FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.Number);
  const [number, setNumber] = useState<string>("");
  const [toastState, setToastState] = useState<ToastState>({
    show: false,
    message: "",
  });

  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "visible";
    return null;
  }

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
      <div className="auth-modal">
        <div className="auth-modal-content">{renderSwitch(authStep)}</div>
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
