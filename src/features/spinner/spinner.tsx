import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import SpinnerJSON from "./spinner.json";
import "./spinner.css";
import ReactPortal from "../reactPortal/reactPortal";

const Spinner = () => {
  return (
    <ReactPortal wrapperId="portal">
      <div className="spinner-content">
        <Player
          autoplay={true}
          loop={true}
          src={SpinnerJSON}
          style={{ height: "60px", width: "60px" }}
        ></Player>
      </div>
    </ReactPortal>
  );
};

export default Spinner;
