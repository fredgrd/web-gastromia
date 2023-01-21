import React, { useRef, useState } from "react";
import "./checkout-selector-button.css";

import { ReactComponent as ArrowDownIcon } from "../../assets/arrow-down@16px.svg";
import useClickOutside from "../../utils/useClickOutside";

const CheckoutSelectorButton: React.FC<{
  isEnabled: boolean;
  options: {
    title: string;
    subtitle: string;
    iconRest: string;
    iconSelected: string;
  };
  children: React.ReactNode;
}> = ({ isEnabled, options, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useClickOutside(elementRef, () => setIsOpen(false));

  const onClick = () => {
    if (!isEnabled) {
      return;
    }

    setIsOpen((state) => !state);
  };

  return (
    <div className="checkout-selectors-checkoutselectorbutton" ref={elementRef}>
      <div
        className="checkout-selectors-checkoutselectorbutton-header"
        onClick={onClick}
      >
        <img
          className="checkout-selectors-checkoutselectorbutton-header-img"
          src={isOpen ? options.iconSelected : options.iconRest}
        />
        <div className="checkout-selectors-checkoutselectorbutton-header-info">
          <span className="checkout-selectors-checkoutselectorbutton-header-info-title">
            {options.title}
          </span>
          {!isOpen ? (
            <span className="checkout-selectors-checkoutselectorbutton-header-info-subtitle">
              {options.subtitle}
            </span>
          ) : null}
        </div>

        {isEnabled ? (
          <ArrowDownIcon
            fill="#BDBDBD"
            style={isOpen ? { transform: "rotateZ(180deg)" } : {}}
          />
        ) : null}
      </div>

      {isOpen ? (
        <div className="checkout-selectors-checkoutselectorbutton-extended">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default CheckoutSelectorButton;
