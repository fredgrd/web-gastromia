import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setToastState } from "../../../app/store-slices/app-slice";
import { setCredentials } from "../../../app/store-slices/auth-slice";
import {
  startVerification,
  completeVerification,
} from "../../../app/services/auth-api";
import PrimaryButton from "../../gastromiaKit/buttons/primaryButton";

import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left@20px.svg";
import { fetchRemoteSnapshot } from "../../../app/store-slices/cart-slice";
import { AppDispatch } from "../../../app/store";

const CodeInput: React.FC<{
  number: string;
  onDone: () => void;
  onClose: () => void;
  onNext: () => void;
}> = ({ number, onDone, onClose, onNext }) => {
  const [code, setCode] = useState<string>("");
  const [resendButtonState, setResendButtonState] = useState<{
    show: boolean;
    countdown: number;
  }>({ show: true, countdown: 20 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const showToast = (message: string) => {
    dispatch(
      setToastState({
        isOpen: true,
        message: message,
      })
    );
  };

  // Declare timeout, and setup cleanup funcion
  const interval = useRef<NodeJS.Timer | undefined>();
  useEffect(() => {
    if (resendButtonState.countdown === 0) clearInterval(interval.current);
  }, [resendButtonState]);

  // Handle input text
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setCode(event.target.value.slice(0, 6));
    }
  };

  // Retry sending the verification OTP
  const retryVerification = async () => {
    if (resendButtonState.show) {
      // The resend button was visible + clicked
      interval.current = setInterval(() => {
        setResendButtonState((state) => ({
          show: state.countdown - 1 === 0,
          countdown: state.countdown === 0 ? 20 : state.countdown - 1,
        }));
      }, 1000);
    } else {
      return;
    }

    const result = await startVerification(number);

    if (result.success) {
      showToast(`Codice inviato al ${number}`);
    } else if (result.status === 400) {
      showToast("Operazione fallita. Controlla il numero e riprova");
    } else {
      showToast("Ops.. qualcosa è andato storto");
    }
  };

  // Try complete the verification
  const onClick = async () => {
    setIsLoading(true);
    const result = await completeVerification(number, code);

    if (result.user) {
      console.log("USER", result.user);
      dispatch(setCredentials({ user: result.user }));
      dispatch(fetchRemoteSnapshot());
      onDone();
    } else if (result.status === 200) {
      console.log("Verification Completed - NewUser");
      onNext();
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
            <ArrowLeft />
          </button>
        </div>
        <h2 className="auth-modal-heading">Verifica il codice</h2>
      </div>
      <div className="auth-modal-body">
        <div className="auth-modal-info">
          <p className="auth-modal-info-p">
            Inserisci il codice a 6 cifre che abbiamo inviato tramite SMS al{" "}
            {number}
          </p>
        </div>
        <div className="auth-modal-code-content">
          <input
            className="auth-modal-codeinput"
            type="number"
            placeholder="_  _  _  _  _  _"
            value={code}
            onChange={onChange}
            autoComplete="one-time-code"
          ></input>
        </div>
        <button
          className={`text-btn ${
            !resendButtonState.show && "text-btn-disabled"
          } auth-modal-resendbtn`}
          onClick={retryVerification}
        >
          {`Invia di nuovo${
            resendButtonState.show ? "" : ` (${resendButtonState.countdown}s)`
          }`}
        </button>
        {code.length === 6 && (
          <PrimaryButton
            onClick={onClick}
            options={{
              title: "Continua",
              isEnabled: true,
              isVisible: true,
              isLoading: isLoading,
            }}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default CodeInput;
