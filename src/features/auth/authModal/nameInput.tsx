import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../app/storeSlices/authSlice";
import { createUser } from "../../../app/services/gastromiaApi";
import Toast, { ToastState } from "../../toast/toast";

import { ReactComponent as Close } from "../../../assets/close@20px.svg";
import PrimaryButton from "../../gastromiaKit/buttons/primaryButton";

const NameInput: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [name, setName] = useState<string>("");
  const [toastState, setToastState] = useState<ToastState>({
    show: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[A-Za-z]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setName(event.target.value);
    }
  };

  const onClick = async () => {
    setIsLoading(true);

    const result = await createUser(name);

    if (result.user) {
      // User was created
      dispatch(setCredentials({ user: result.user }));
      onDone();
    } else if (result.status === 400) {
      setToastState({
        show: true,
        message: "Operazione fallita. Riprova a registrarti",
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
          <button className="icon-btn" onClick={onDone}>
            <Close />
          </button>
        </div>
        <h2 className="auth-modal-heading">Benvenuto 🎉</h2>
      </div>
      <div className="auth-modal-body">
        <div className="auth-modal-info">
          <p className="auth-modal-info-p">Ciao! Come ti chiami?</p>
        </div>
        <div className="auth-modal-name-content">
          <input
            className="auth-modal-nameinput"
            type="text"
            placeholder="Il tuo nome"
            value={name}
            onChange={onChange}
          ></input>
        </div>
        {name.length > 0 && (
          <div className="auth-modal-nameinput-donebtn">
            <PrimaryButton
              onClick={onClick}
              options={{
                title: "Completa",
                buttonColor: undefined,
                showButton: !isLoading,
                showSpinner: isLoading,
              }}
            />
          </div>
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

export default NameInput;
