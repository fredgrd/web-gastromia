import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToastState } from "../../app/store-slices/app-slice";
import { detachCard, fetchCards } from "../../app/services/payment-api";
import { logout } from "../../app/services/auth-api";
import { selectCurrentUser } from "../../app/store-slices/auth-slice";
import { Card } from "../../models/card";
import "./settings-page.css";

import SetupPaymentModal from "../payment/setup-payment-modal";

import { ReactComponent as AddCardIcon } from "../../assets/card@25px.svg";
import { ReactComponent as ArrowDownIcon } from "../../assets/arrow-down@16px.svg";
import { ReactComponent as LogoutIcon } from "../../assets/logout@24px.svg";
import SettingsPageNameModal from "./settings-page-name-modal";

const SettingsPage: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [showSetupCardModal, setSetupShowCardModal] = useState<boolean>(false);
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateCards = async () => {
    const cards = await fetchCards();
    if (cards) {
      setCards(cards);
    }
  };

  useEffect(() => {
    updateCards();
  }, []);

  const logoutOnClick = async () => {
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

  const detachOnClick = async (id: string) => {
    const detached = await detachCard(id);

    dispatch(
      setToastState({
        isOpen: true,
        message: "Rimuovendo la carta",
      })
    );

    if (detached) {
      updateCards();
    } else {
      dispatch(
        setToastState({
          isOpen: true,
          message: "Non è stato possibile rimuovere la carta",
        })
      );
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="settingspage">
      <div className="settingspage-header">
        <h2 className="settingspage-header-heading">Impostazioni account</h2>
      </div>

      <hr className="settingspage-break" />

      <div className="settingspage-section">
        <span className="settingspage-section-header">
          Informazioni personali
        </span>

        <div className="settingspage-section-entry">
          <div className="settingspage-section-entry-header">
            <span className="settingspage-section-entry-heading">Telefono</span>
          </div>
          <span className="settingspage-section-entry-value">
            {user?.number}
          </span>
        </div>

        <div className="settingspage-section-entry">
          <div className="settingspage-section-entry-header">
            <span className="settingspage-section-entry-heading">Nome</span>
            <button
              className="settingspage-section-entry-btn"
              onClick={() => setShowNameModal(true)}
            >
              Cambia
            </button>
          </div>
          <span className="settingspage-section-entry-value">{user?.name}</span>
        </div>

        <SettingsPageNameModal
          isOpen={showNameModal}
          onClose={() => setShowNameModal(false)}
        />
      </div>

      <hr className="settingspage-break" />

      <div className="settingspage-section">
        <span className="settingspage-section-header">Metodi di pagamento</span>

        {cards.map((card, idx) => (
          <div className="settingspage-section-entry" key={idx}>
            <div className="settingspage-section-entry-header">
              <span className="settingspage-section-entry-heading">
                {`${card.brand.toUpperCase()} *${card.last4}`}
              </span>
              <span className="settingspage-section-entry-value">{`Exp. ${card.exp_month}-${card.exp_year}`}</span>
            </div>
            <div className="settingspage-section-entry-btn-positioner">
              <button
                className="settingspage-section-entry-btn"
                style={{
                  color: "black",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
                onClick={() => detachOnClick(card.id)}
              >
                Rimuovi
              </button>
            </div>
          </div>
        ))}
        <button
          className="settingspage-addcardbtn"
          onClick={() => setSetupShowCardModal(true)}
        >
          <AddCardIcon fill="#343538" />

          <span className="settingspage-addcardbtn-title">
            Aggiungi una carta
          </span>

          <ArrowDownIcon
            fill="#BDBDBD"
            style={{ transform: "rotateZ(-90deg)" }}
          />
        </button>

        <SetupPaymentModal
          isOpen={showSetupCardModal}
          onClose={() => {
            setSetupShowCardModal(false);
            updateCards();
          }}
        />
      </div>

      <hr className="settingspage-break" />

      <div className="settingspage-logoutbtn-positioner">
        <button className="settingspage-logoutbtn" onClick={logoutOnClick}>
          <LogoutIcon fill="#343537" />
          <span className="settingspage-logoutbtn-title">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
