import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setAuthModalState,
  setToastState,
} from "../../app/store-slices/app-slice";
import { selectCurrentUser } from "../../app/store-slices/auth-slice";
import useClickOutside from "../../utils/useClickOutside";
import { AnimatePresence, motion } from "framer-motion";
import formatDate from "../../utils/formatDate";
import { logout } from "../../app/services/auth-api";
import PrimaryButton from "../gastromiaKit/buttons/primaryButton";
import ReactPortal from "../reactPortal/reactPortal";
import "./menuDrawer.css";

import UserAvatar from "../../assets/images/useravatar.png";
import { ReactComponent as LoginIcon } from "../../assets/login@24px.svg";
import { ReactComponent as HomeIcon } from "../../assets/home@24px.svg";
import { ReactComponent as OrdersIcon } from "../../assets/orders@24px.svg";
import { ReactComponent as CoffeeIcon } from "../../assets/coffee@24px.svg";
import { ReactComponent as SettingsIcon } from "../../assets/settings@24px.svg";
import { ReactComponent as PaymentsIcon } from "../../assets/payments@24px.svg";
import { ReactComponent as HelpIcon } from "../../assets/help@24px.svg";
import { ReactComponent as FaqIcon } from "../../assets/faq@24px.svg";
import { ReactComponent as LogoutIcon } from "../../assets/logout@24px.svg";

const DrawerButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  options: { title: string; style: React.CSSProperties | undefined };
}> = ({ children, onClick, options }) => {
  return (
    <button
      className="menudrawer-button"
      style={options.style}
      onClick={onClick}
    >
      {children}
      <span className="menudrawer-button-title">{options.title}</span>
    </button>
  );
};

const MenuDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  let timeout: NodeJS.Timeout | undefined;
  const drawerRef = useRef<HTMLDivElement>(null);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [firstLocation, setFirstLocation] = useState<string>("/");

  useClickOutside(drawerRef, onClose);

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFirstLocation(location.pathname);
    }
  }, [isOpen]);

  useEffect(() => {
    if (firstLocation !== location.pathname) {
      onClose();
    }
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isOpen]);

  const onSignUpClick = () => {
    onClose();

    timeout = setTimeout(() => {
      dispatch(setAuthModalState({ isOpen: true }));
    }, 200);
  };

  const onLogout = async () => {
    const logoutConfirmation = window.confirm("Sei sicuro di voler uscire?");

    if (logoutConfirmation) {
      const isLogout = await logout();

      if (isLogout) {
        navigate(0);
      } else {
        dispatch(
          setToastState({
            isOpen: true,
            message: "Non è stato possibile effettuare il logout",
          })
        );
      }
    }
  };

  return (
    <ReactPortal wrapperId="portal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="menudrawer"
            className="menudrawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="menudrawer-content"
              ref={drawerRef}
              initial={{ x: "-260px" }}
              animate={{ x: "0px" }}
              exit={{ x: "-260px" }}
              transition={{ duration: 0.2 }}
            >
              <div className="menudrawer-header">
                {user ? (
                  <React.Fragment>
                    <div className="menudrawer-header-hiuser-heading">
                      <img
                        className="menudrawer-header-hiuser-img"
                        src={UserAvatar}
                      />
                      <span className="menudrawer-header-hiuser-name">
                        {user.name}
                      </span>
                    </div>

                    <span className="menudrawer-header-hiuser-date">{`Cliente Gastromia da ${formatDate(
                      user.createdAt
                    )}`}</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <PrimaryButton
                      onClick={onSignUpClick}
                      options={{
                        title: "Registrati",
                        isEnabled: true,
                        isVisible: true,
                        isLoading: false,
                      }}
                    />

                    <DrawerButton
                      onClick={onSignUpClick}
                      options={{
                        title: "Log in",
                        style: { marginTop: "16px" },
                      }}
                    >
                      <LoginIcon fill="#343538" />
                    </DrawerButton>
                  </React.Fragment>
                )}
              </div>

              <hr className="menudrawer-break" />

              <div className="menudrawer-maincontents">
                <DrawerButton
                  onClick={() => {
                    onClose();
                    navigate("/");
                  }}
                  options={{
                    title: "Home",
                    style: { color: "white", backgroundColor: "#343538" },
                  }}
                >
                  <HomeIcon fill="white" />
                </DrawerButton>

                <DrawerButton
                  onClick={() => {
                    onClose();
                    navigate("/orders");
                  }}
                  options={{
                    title: "Ordini",
                    style: { marginTop: "4px" },
                  }}
                >
                  <OrdersIcon fill="#343538" />
                </DrawerButton>

                {false && (
                  <DrawerButton
                    onClick={() => {
                      onClose();
                      navigate("/coffee+");
                    }}
                    options={{
                      title: "Coffee +",
                      style: { marginTop: "4px" },
                    }}
                  >
                    <CoffeeIcon fill="#343538" />
                  </DrawerButton>
                )}

                <hr className="menudrawer-break" />

                <h2 className="menudrawer-sectiontitle">Info</h2>

                <DrawerButton
                  onClick={() => {
                    onClose();
                    navigate("/settings");
                  }}
                  options={{
                    title: "Impostazioni account",
                    style: { marginTop: "4px" },
                  }}
                >
                  <SettingsIcon fill="#343538" />
                </DrawerButton>

                <DrawerButton
                  onClick={() => {
                    onClose();
                    navigate("/settings");
                  }}
                  options={{
                    title: "Metodi di pagamento",
                    style: { marginTop: "4px" },
                  }}
                >
                  <PaymentsIcon fill="#343538" />
                </DrawerButton>

                <hr className="menudrawer-break" />

                <h2 className="menudrawer-sectiontitle">Supporto</h2>

                <DrawerButton
                  onClick={() => {
                    onClose();
                    navigate("/help");
                  }}
                  options={{
                    title: "Centro assistenza",
                    style: { marginTop: "4px" },
                  }}
                >
                  <HelpIcon fill="#343538" />
                </DrawerButton>

                <DrawerButton
                  onClick={() => {
                    onClose();
                    navigate("/help/faq");
                  }}
                  options={{
                    title: "FAQ",
                    style: { marginTop: "4px" },
                  }}
                >
                  <FaqIcon fill="#343538" />
                </DrawerButton>

                <hr className="menudrawer-break" />

                {user ? (
                  <React.Fragment>
                    <DrawerButton
                      onClick={onLogout}
                      options={{
                        title: "Logout",
                        style: { marginTop: "4px" },
                      }}
                    >
                      <LogoutIcon fill="#343538" />
                    </DrawerButton>

                    <hr className="menudrawer-break" />
                  </React.Fragment>
                ) : null}

                <div className="menudrawer-footer">
                  <a className="menudrawer-footer-item">Jobs</a>
                  <span>&nbsp;·&nbsp;</span>
                  <a className="menudrawer-footer-item">Termini</a>
                  <span>&nbsp;·&nbsp;</span>
                  <a className="menudrawer-footer-item">Privacy</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default MenuDrawer;
