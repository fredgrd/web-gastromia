import React from "react";
import { useNavigate } from "react-router-dom";
import "./not-found.css";

import PrimaryButton from "../gastromiaKit/buttons/primaryButton";

import { ReactComponent as NotFoundIcon } from "../../assets/not-found@150px.svg";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="notfound">
      <NotFoundIcon />
      <span className="notfound-heading1">Non c'è niente da mangiare qui</span>
      <span className="notfound-heading2">Scopri qualcosa di delizioso</span>

      <div className="notfound-navigatebtn-positioner">
        <PrimaryButton
          onClick={() => navigate("/")}
          options={{
            title: "Mangiamo!",
            isEnabled: true,
            isLoading: false,
            isVisible: true,
          }}
        />
      </div>
    </div>
  );
};

export default NotFound;
