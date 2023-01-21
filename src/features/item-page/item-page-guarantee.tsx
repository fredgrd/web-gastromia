import React, { useState, useRef } from "react";
import useScrollListener from "../../utils/useScrollListener";
import useClickOutside from "../../utils/useClickOutside";
import "./item-page-guarantee.css";

import { ReactComponent as GuaranteeIcon } from "../../assets/guarantee@16px.svg";
import { ReactComponent as InfoIcon } from "../../assets/info@16px.svg";
import { ReactComponent as TriangleIcon } from "../../assets/triangle@20px.svg";

const ItemPageGuarantee: React.FC = () => {
  const [showGuaranteeDisclaimer, setShowGuaranteeDisclaimer] =
    useState<boolean>(false);
  const guaranteeDisclaimerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  // Handles click outside for teh
  useClickOutside(guaranteeDisclaimerRef, () =>
    setShowGuaranteeDisclaimer(false)
  );

  // Updates the scroll position of the page
  useScrollListener(() => setScrollPosition(window.pageYOffset));

  return (
    <div className="itempage-guarantee-content">
      <div className="itempage-guarantee-title-content">
        <GuaranteeIcon />
        <span className="itempage-guarantee-title">
          Ordine garantito al 100%
        </span>
        <div className="itempage-guarantee-info-content">
          <button
            className="itempage-guarantee-info-btn"
            onClick={() => setShowGuaranteeDisclaimer(true)}
          >
            <InfoIcon />
          </button>
          {showGuaranteeDisclaimer ? (
            <div
              className="itempage-guarantee-info-disclaimer-content"
              style={
                scrollPosition > 38.5 ? { top: "28px" } : { bottom: "28px" }
              }
              ref={guaranteeDisclaimerRef}
            >
              <TriangleIcon
                fill="#1f5a96"
                className="itempage-guarantee-info-disclaimer-triangle"
                style={
                  scrollPosition > 38.5
                    ? { top: "-16px" }
                    : { bottom: "-16px", transform: "rotateZ(180deg)" }
                }
              />
              <h3 className="itempage-guarantee-info-disclaimer-title">
                Ordine garantito al 100%
              </h3>
              <p className="itempage-guarantee-info-disclaimer">
                Se riscontri uno dei seguenti problemi hai diritto a un rimborso
                o ad un credito: articoli danneggiati/mancanti, articoli
                scadenti, o servizio non professionale.
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="itempage-guarantee-subtitle-content">
        <span className="itempage-guarantee-subtitle">
          Effettua il tuo ordine in tutta tranquillità.
        </span>
      </div>
    </div>
  );
};

export default ItemPageGuarantee;
