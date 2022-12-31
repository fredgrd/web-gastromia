import React, { useCallback, useEffect } from "react";
import "./toast.css";

import ReactPortal from "../reactPortal/reactPortal";
import { ReactComponent as ToastInfoIcon } from "../../assets/toast-info@24px.svg";

export interface ToastState {
  show: boolean;
  message: string;
}

const Toast: React.FC<{
  message: string;
  duration?: number;
  onDone: () => void;
}> = ({ message, duration = 3000, onDone }) => {
  // Timer for 3seconds

  const cachedOnDone = useCallback(onDone, [onDone]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      cachedOnDone();
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [cachedOnDone, duration]);

  return (
    <ReactPortal wrapperId="portal">
      <div className="toast-content">
        <ToastInfoIcon className="toast-icon" />
        <div className="toast-body">
          <p className="toast-text">{message}</p>
        </div>
      </div>
    </ReactPortal>
  );
};

export default Toast;
