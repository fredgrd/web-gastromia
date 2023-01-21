import React, { useState } from "react";
import PrimaryButton from "../../gastromiaKit/buttons/primaryButton";
import { startVerification } from "../../../app/services/auth-api";
import { useDispatch } from "react-redux";
import { setToastState } from "../../../app/store-slices/app-slice";

import { ReactComponent as Close } from "../../../assets/close@20px.svg";

const NumberInput: React.FC<{
  onClose: () => void;
  onDone: (number: string) => void;
}> = ({ onClose, onDone }) => {
  const countryCode = "+39";
  const [number, setNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const showToast = (message: string) => {
    dispatch(
      setToastState({
        isOpen: true,
        message: message,
      })
    );
  };

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
      showToast("Inserisci il tuo numero per continuare");
      return;
    }

    const formattedNumber = `${countryCode}${number}`;
    const result = await startVerification(formattedNumber);

    if (result.success) {
      onDone(formattedNumber);
    } else if (result.status === 400) {
      showToast("Operazione fallita. Controlla il numero e riprova");
    } else {
      showToast("Ops.. qualcosa è andato storto");
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
            isEnabled: true,
            isVisible: true,
            isLoading: isLoading,
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default NumberInput;
