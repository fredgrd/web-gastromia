import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setToastState } from "../../../app/store-slices/app-slice";
import { setCredentials } from "../../../app/store-slices/auth-slice";
import { createUser } from "../../../app/services/user-api";
import PrimaryButton from "../../gastromiaKit/buttons/primaryButton";

import { ReactComponent as Close } from "../../../assets/close@20px.svg";

const NameInput: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [name, setName] = useState<string>("");
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[A-Za-z]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setName(event.target.value);
    }
  };

  const onClick = async () => {
    setIsLoading(true);

    const user = await createUser(name);

    if (user) {
      // User was created
      dispatch(setCredentials({ user: user }));
      onDone();
    } else {
      showToast("Ops.. qualcosa è andato storto");
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
                isEnabled: true,
                isVisible: true,
                isLoading: isLoading,
              }}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default NameInput;
