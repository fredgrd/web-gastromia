import React, { useState } from "react";
import Toast, { ToastState } from "../../toast/toast";
import PrimaryButton from "../../gastromiaKit/buttons/primaryButton";
import { startVerification } from "../../../app/services/authApi";

import { ReactComponent as Close } from "../../../assets/close@20px.svg";

const NumberInput: React.FC<{
  onClose: () => void;
  onDone: (number: string) => void;
}> = ({ onClose, onDone }) => {
  const countryCode = "+39";
  const [number, setNumber] = useState<string>("");
  const [toastState, setToastState] = useState<ToastState>({
    show: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle keyboard inputs
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setNumber(event.target.value);
    }
  };

  // Start the phone number verification process
  const onClick = async () => {
    setIsLoading(true);

    if (!number.length) {
      setIsLoading(false);
      setToastState({
        show: true,
        message: "Inserisci il tuo numero per continuare",
      });
      return;
    }

    const formattedNumber = `${countryCode}${number}`;
    const result = await startVerification(formattedNumber);

    if (result.success) {
      onDone(formattedNumber);
    } else if (result.status === 400) {
      setToastState({
        show: true,
        message: "Operazione fallita. Controlla il numero e riprova",
      });
    } else {
      setToastState({
        show: true,
        message: "Ops.. qualcosa è andato storto",
      });
    }

    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <div className="auth-modal-header">
        <div className="auth-modal-icon">
          <button className="icon-btn" onClick={onClose}>
            <Close />
          </button>
        </div>
        <h2 className="auth-modal-heading">Accedi</h2>
      </div>
      <div className="auth-modal-body">
        <div className="auth-modal-info">
          <p className="auth-modal-info-p">
            Inserisci il tuo numero per iniziare
          </p>
        </div>
        <div className="auth-modal-number-content">
          <div className="auth-modal-countrycode-content">
            <p className="auth-modal-countrycode">{countryCode}</p>
          </div>
          <div className="auth-modal-numberinput-content">
            <input
              className="auth-modal-numberinput"
              type="text"
              placeholder="3478210921"
              value={number}
              onChange={onChange}
              autoFocus
              autoComplete="tel-national"
            ></input>
          </div>
        </div>
        <p className="auth-modal-ratesdisclaimer">
          Ti invieremo un SMS con un codice di verifica. Potrebbero essere
          applicate tariffe per messaggi e dati.
        </p>
        <PrimaryButton
          onClick={onClick}
          options={{
            title: "Continua",
            buttonColor: undefined,
            showButton: !isLoading,
            showSpinner: isLoading,
          }}
        />
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
    </React.Fragment>
  );
};

export default NumberInput;
