import React, { FC, useEffect, useRef, useState } from "react";
import {
  useCheckVerificationMutation,
  useStartVerificationMutation,
} from "../../app/services/gastromia";
import "./authModal.css";

import ReactPortal from "../reactPortal/reactPortal";
import Toast, { ToastState } from "../toast/toast";
import { ReactComponent as Close } from "../../assets/close@20px.svg";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left@20px.svg";

enum AuthStep {
  Number,
  Code,
  Name,
}

const NumberInput: FC<{
  onClose: () => void;
  onDone: (number: string) => void;
}> = ({ onClose, onDone }) => {
  const countryCode = "+39";
  const [number, setNumber] = useState<string>("");
  const [verificationMutation] = useStartVerificationMutation();
  const [toastState, setToastState] = useState<ToastState>({
    show: false,
    message: "",
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setNumber(event.target.value);
    }
  };

  const startVerification = async () => {
    if (!number.length) {
      setToastState({
        show: true,
        message: "Inserisci il tuo numero per continuare",
      });
      return;
    }

    try {
      const interNumber = `${countryCode}${number}`;
      await verificationMutation(interNumber).unwrap();
      onDone(interNumber);
    } catch (error) {
      if (error === 500) {
        setToastState({
          show: true,
          message: "Ops.. qualcosa è andato storto",
        });
      } else {
        setToastState({
          show: true,
          message: "Operazione fallita. Controlla il numero e riprova",
        });
      }
    }
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
        <button className="main-btn" onClick={startVerification}>
          Continua
        </button>
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

const CodeInput: FC<{
  number: string;
  onDone: () => void;
  onClose: () => void;
}> = ({ number, onDone, onClose }) => {
  const [code, setCode] = useState<string>("");
  const [verificationMutation] = useStartVerificationMutation();
  const [checkVerificationMutation] = useCheckVerificationMutation();
  const [toastState, setToastState] = useState<ToastState>({
    show: false,
    message: "",
  });
  const [resendButtonState, setResendButtonState] = useState<{
    show: boolean;
    countdown: number;
  }>({ show: true, countdown: 20 });

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

    try {
      await verificationMutation(number).unwrap();
    } catch (error) {
      if (error === 500) {
        setToastState({
          show: true,
          message: "Ops.. qualcosa è andato storto",
        });
      } else {
        setToastState({
          show: true,
          message: "Operazione fallita. Controlla il numero e riprova",
        });
      }
    }
  };

  const checkVerification = async () => {
    try {
      await checkVerificationMutation({ number, code }).unwrap();
      onDone();
    } catch (error) {
      if (error === 500) {
        setToastState({
          show: true,
          message: "Ops.. qualcosa è andato storto",
        });
      } else {
        setToastState({
          show: true,
          message: "Operazione fallita. Controlla il codice e riprova.",
        });
      }
    }
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
          <button className="main-btn" onClick={checkVerification}>
            Continua
          </button>
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

const NameInput: FC<{ onClose: () => void; onDone: () => void }> = ({
  onClose,
  onDone,
}) => {
  const [name, setName] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[A-Za-z]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setName(event.target.value);
    }
  };

  return (
    <React.Fragment>
      <div className="auth-modal-header">
        <div className="auth-modal-icon">
          <button className="icon-btn" onClick={onClose}>
            <ArrowLeft />
          </button>
        </div>
        <h2 className="auth-modal-heading">Il tuo nome</h2>
      </div>
      <div className="auth-modal-body">
        <div className="auth-modal-info">
          <p className="auth-modal-info-p">Ciao! Come ti chiami?</p>
        </div>
        <div className="auth-modal-code-content">
          <input
            className="auth-modal-codeinput"
            type="text"
            placeholder="_  _  _  _  _  _"
            value={name}
            onChange={onChange}
          ></input>
        </div>
        <button className="main-btn">Continua</button>
      </div>
    </React.Fragment>
  );
};

const AuthModal = (props: { isOpen: boolean; onClose: () => void }) => {
  const { isOpen, onClose } = props;
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.Number);
  const [number, setNumber] = useState<string>("");

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
            onDone={() => {
              console.log("Check user w/ display spinner");
            }}
          />
        );
      case AuthStep.Name:
        return (
          <NameInput onClose={onClose} onDone={() => console.log("done")} />
        );
    }
  };

  return (
    <ReactPortal wrapperId="portal">
      <div className="auth-modal">
        <div className="auth-modal-content">{renderSwitch(authStep)}</div>
      </div>
    </ReactPortal>
  );
};

export default AuthModal;
