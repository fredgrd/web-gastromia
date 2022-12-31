import React, { useState, useEffect, useRef } from "react";
import Toast, { ToastState } from "../../toast/toast";
import PrimaryButton from "../../gastromiaKit/buttons/primaryButton";
import {
  startVerification,
  checkVerification,
} from "../../../app/services/gastromiaApi";

import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left@20px.svg";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../app/storeSlices/authSlice";

const CodeInput: React.FC<{
  number: string;
  onDone: () => void;
  onClose: () => void;
  onNext: () => void;
}> = ({ number, onDone, onClose, onNext }) => {
  const [code, setCode] = useState<string>("");
  const [toastState, setToastState] = useState<ToastState>({
    show: false,
    message: "",
  });
  const [resendButtonState, setResendButtonState] = useState<{
    show: boolean;
    countdown: number;
  }>({ show: true, countdown: 20 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

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
      setToastState({
        show: true,
        message: `Codice inviato al ${number}`,
      });
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
  };

  const onClick = async () => {
    setIsLoading(true);
    const result = await checkVerification(number, code);

    if (result.user) {
      console.log("USER", result.user);
      dispatch(setCredentials({ user: result.user }));
      onDone();
    } else if (result.status === 200) {
      // Proceed to input name
      console.log("Status 200");
      onNext();
    } else if (result.status === 400) {
      setToastState({
        show: true,
        message: "Operazione fallita. Controlla il codice e riprova",
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
              buttonColor: undefined,
              showButton: !isLoading,
              showSpinner: isLoading,
            }}
          />
        )}
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

export default CodeInput;
