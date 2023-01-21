import React, { useState } from "react";
import ReactPortal from "../reactPortal/reactPortal";
import { createSetupIntent } from "../../app/services/payment-api";
import { AnimatePresence, motion } from "framer-motion";
import {
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
} from "@stripe/stripe-js";
import {
  CardNumberElement,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import PrimaryInput from "../gastromiaKit/buttons/primaryInput";
import PrimaryButton from "../gastromiaKit/buttons/primaryButton";
import "./setup-payment-modal.css";

import { ReactComponent as Close } from "../../assets/close@20px.svg";

const SetupPaymentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [cardIsFocused, setCardIsFocused] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [cardFilled, setCardFilled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();

  const cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        color: "#343538",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "15px",
        "::placeholder": {
          color: "#343538",
        },
      },
      invalid: {
        fontFamily: "Arial, sans-serif",
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const cardOnChange = (event: StripeCardElementChangeEvent) => {
    setCardFilled(event.complete);
  };

  const addressOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const addressRGEX = /^(?:[a-zA-Z0-9/ ]+)?$/;
    const addressResult = addressRGEX.test(event.target.value);

    if (addressResult) {
      setAddress(event.target.value);
    }
  };

  const zipOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const zipRGEZ = /^[0-9]*$/;
    const zipResult = zipRGEZ.test(event.target.value);

    if (zipResult) {
      setZip(event.target.value);
    }
  };

  const onSubmit = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.log("CARD ELEMENT IS NULL");
      setIsLoading(false);
      return;
    }

    // Create a setup intent
    const clientSecret = await createSetupIntent();

    if (!clientSecret) {
      setIsLoading(false);
      console.log("NO client secret");
      return;
    }

    const payload = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    console.log(payload);
    setIsLoading(false);
    onClose();
  };

  return (
    <ReactPortal wrapperId="portal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="setuppayment-modal"
          >
            <div className="setuppayment-modal-header">
              <div className="setuppayment-modal-header-icon">
                <button
                  className="icon-btn"
                  onClick={() => {
                    setCardFilled(false);
                    setAddress("");
                    setZip("");
                    setCardIsFocused(false);
                    setIsLoading(false);
                    onClose();
                  }}
                >
                  <Close />
                </button>
              </div>
              <h2 className="setuppayment-modal-header-heading">
                Aggiungi una carta
              </h2>
            </div>

            <div className="setuppayment-modal-paymentinfo">
              <motion.div
                animate={{ borderColor: cardIsFocused ? "#00AD0A" : "#E3E3E3" }}
                transition={{ duration: 0.2 }}
                className="setuppayment-modal-cardinput"
              >
                <CardElement
                  options={cardOptions}
                  onChange={cardOnChange}
                  onFocus={() => setCardIsFocused(true)}
                  onBlur={() => setCardIsFocused(false)}
                />
              </motion.div>

              <PrimaryInput
                onChange={addressOnChange}
                value={address}
                options={{
                  labelTitle: "Indirizzo di fatturazione",
                  style: { marginTop: "16px" },
                }}
              />

              <PrimaryInput
                onChange={zipOnChange}
                value={zip}
                options={{
                  labelTitle: "CAP",
                  style: { marginTop: "16px", maxWidth: "120px" },
                }}
              />
            </div>

            <div className="setuppayment-modal-save">
              <PrimaryButton
                onClick={onSubmit}
                options={{
                  title: "Salva",
                  isEnabled: address.length > 0 && zip.length > 0 && cardFilled,
                  isLoading: isLoading,
                  isVisible: true,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default SetupPaymentModal;
