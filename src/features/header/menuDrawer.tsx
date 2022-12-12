import React, { useEffect, useRef, useState } from "react";
import useClickOutside from "../../utils/useClickOutside";
import PrimaryButton from "../gastromiaKit/buttons/primaryButton";
import ReactPortal from "../reactPortal/reactPortal";
import "./menuDrawer.css";

import { ReactComponent as LoginIcon } from "../../assets/login@24px.svg";
import { ReactComponent as HomeIcon } from "../../assets/home@24px.svg";
import { ReactComponent as OrdersIcon } from "../../assets/orders@24px.svg";
import { ReactComponent as CoffeeIcon } from "../../assets/coffee@24px.svg";
import { ReactComponent as SettingsIcon } from "../../assets/settings@24px.svg";
import { ReactComponent as PaymentsIcon } from "../../assets/payments@24px.svg";
import { ReactComponent as HelpIcon } from "../../assets/help@24px.svg";
import { ReactComponent as FaqIcon } from "../../assets/faq@24px.svg";

const DrawerButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  options: { title: string; style: React.CSSProperties | undefined };
}> = ({ children, onClick, options }) => {
  return (
    <button className="drawermodal-button" style={options.style}>
      {children}
      <span className="drawermodal-button-title">{options.title}</span>
    </button>
  );
};

enum DrawerState {
  Visible,
  Hidden,
}

const MenuDrawer: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  const [drawerState, setDrawerState] = useState<DrawerState>(
    DrawerState.Visible
  );
  const drawerRef = useRef<HTMLDivElement>(null);

  useClickOutside(drawerRef, () => setDrawerState(DrawerState.Hidden));

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (drawerState === DrawerState.Hidden) {
      timeout = setTimeout(() => {
        setDrawerState(DrawerState.Visible);
        onClose();
      }, 200);
    }

    return () => clearTimeout(timeout);
  }, [drawerState]);

  if (!show) {
    return null;
  }

  return (
    <ReactPortal wrapperId="portal">
      <div
        id="drawermodal"
        className={`drawermodal ${
          drawerState === DrawerState.Visible
            ? "drawermodal-enter"
            : "drawermodal-exit"
        }`}
      >
        <div
          className={`drawermodal-content ${
            drawerState === DrawerState.Visible
              ? "drawermodal-content-enter"
              : "drawermodal-content-exit"
          }`}
          ref={drawerRef}
        >
          <div className="drawermodal-header">
            <PrimaryButton
              onClick={() => console.log("login")}
              options={{
                title: "Registrati",
                buttonColor: "#FF0063",
                showButton: true,
                showSpinner: false,
              }}
            />

            <DrawerButton
              onClick={() => console.log("clicked")}
              options={{
                title: "Log in",
                style: { marginTop: "16px" },
              }}
            >
              <LoginIcon fill="#343538" />
            </DrawerButton>
          </div>

          <hr className="drawermodal-break" />

          <div className="drawermodal-maincontents">
            <DrawerButton
              onClick={() => console.log("clicked")}
              options={{
                title: "Home",
                style: { color: "white", backgroundColor: "#343538" },
              }}
            >
              <HomeIcon fill="white" />
            </DrawerButton>

            <DrawerButton
              onClick={() => console.log("clicked")}
              options={{
                title: "Ordini",
                style: { marginTop: "4px" },
              }}
            >
              <OrdersIcon fill="#343538" />
            </DrawerButton>

            <DrawerButton
              onClick={() => console.log("clicked")}
              options={{
                title: "Coffee +",
                style: { marginTop: "4px" },
              }}
            >
              <CoffeeIcon fill="#343538" />
            </DrawerButton>

            <hr className="drawermodal-break" />

            <h2 className="drawermodal-sectiontitle">Info</h2>

            <DrawerButton
              onClick={() => console.log("clicked")}
              options={{
                title: "Impostazioni account",
                style: { marginTop: "4px" },
              }}
            >
              <SettingsIcon fill="#343538" />
            </DrawerButton>

            <DrawerButton
              onClick={() => console.log("clicked")}
              options={{
                title: "Metodi di pagamento",
                style: { marginTop: "4px" },
              }}
            >
              <PaymentsIcon fill="#343538" />
            </DrawerButton>

            <hr className="drawermodal-break" />

            <h2 className="drawermodal-sectiontitle">Supporto</h2>

            <DrawerButton
              onClick={() => console.log("clicked")}
              options={{
                title: "Centro assistenza",
                style: { marginTop: "4px" },
              }}
            >
              <HelpIcon fill="#343538" />
            </DrawerButton>

            <DrawerButton
              onClick={() => console.log("clicked")}
              options={{
                title: "FAQ",
                style: { marginTop: "4px" },
              }}
            >
              <FaqIcon fill="#343538" />
            </DrawerButton>

            <hr className="drawermodal-break" />

            <div className="drawermodal-footer">
              <a className="drawermodal-footer-item">Jobs</a>
              <span>&nbsp;·&nbsp;</span>
              <a className="drawermodal-footer-item">Termini</a>
              <span>&nbsp;·&nbsp;</span>
              <a className="drawermodal-footer-item">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
};

export default MenuDrawer;
