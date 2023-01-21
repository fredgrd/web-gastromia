import React, { useState } from "react";
import "./settings-page-name-modal.css";

import FullModal from "../gastromiaKit/buttons/full-modal";
import PrimaryInput from "../gastromiaKit/buttons/primaryInput";
import PrimaryButton from "../gastromiaKit/buttons/primaryButton";
import { updateUser } from "../../app/services/user-api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../app/store-slices/auth-slice";
import { setToastState } from "../../app/store-slices/app-slice";

const SettingsPageNameModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nameRGEX = /^(?:[a-zA-Z/ ]+)?$/;
    const nameResult = nameRGEX.test(event.target.value);

    if (nameResult) {
      setName(event.target.value);
    }
  };

  const onSave = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const user = await updateUser({ name: name });

    if (user) {
      dispatch(setCredentials({ user: user }));
      setIsLoading(false);

      setName("");
      onClose();
    } else {
      dispatch(
        setToastState({
          isOpen: true,
          message: "Ops.. Non siamo riusciti a completare l'operazione",
        })
      );
      setIsLoading(false);
    }
  };

  return (
    <FullModal
      isOpen={isOpen}
      onClose={() => {
        setName("");
        onClose();
      }}
      options={{ heading: "Cambia nome" }}
    >
      <div className="settingspagename-modal">
        <PrimaryInput
          value={name}
          onChange={onChange}
          options={{ labelTitle: "Nome" }}
        />

        <div className="settingspagename-modal-savebtn">
          <PrimaryButton
            onClick={onSave}
            options={{
              title: "Salva",
              isEnabled: name.length > 0,
              isLoading: isLoading,
              isVisible: true,
            }}
          />
        </div>
      </div>
    </FullModal>
  );
};

export default SettingsPageNameModal;
