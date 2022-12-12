import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import SpinnerJSON from "../../../assets/spinner-animation.json";
import "./primaryButton.css";

const PrimaryButton: React.FC<{
  onClick: () => void;
  options: {
    title: string;
    buttonColor: string | undefined;
    showButton: boolean;
    showSpinner: boolean;
  };
}> = ({ onClick, options }) => {
  return (
    <div className="gastromiakit-primarybutton-content">
      {options.showButton && (
        <button
          className="gastromiakit-primarybutton-button"
          style={
            options.buttonColor ? { backgroundColor: options.buttonColor } : {}
          }
          onClick={onClick}
        >
          {options.title}
        </button>
      )}
      {options.showSpinner && (
        <Player
          autoplay={true}
          loop={true}
          src={SpinnerJSON}
          style={{ height: "40px", width: "40px" }}
        ></Player>
      )}
    </div>
  );
};

export default PrimaryButton;
