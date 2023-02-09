import React, { useEffect, useState } from 'react';
import { fetchCards } from '../../app/services/payment-api';
import { useStripe } from '@stripe/react-stripe-js';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { setToastState } from '../../app/store-slices/app-slice';
import {
  selectCart,
  selectCartCount,
  selectCartTotal,
  updateCart,
  updateRemoteSnapshot,
} from '../../app/store-slices/cart-slice';
import { createOrder, updatePaidOrder } from '../../app/services/order-api';
import { selectCurrentUser } from '../../app/store-slices/auth-slice';
import { Card } from '../../models/card';
import { Interval } from '../../models/interval';
import { CartItemSnapshot } from '../../models/cart-snapshot';
import formatMinuteTime from '../../utils/formatMinuteTime';
import './checkout.css';

import CheckoutSelectorButton from './checkout-selector-button';
import CheckoutTimePickerModal from './checkout-timepicker-modal';
import SetupPaymentModal from '../payment/setup-payment-modal';
import Skeleton from '../skeleton/skeleton';
import PrimaryButton from '../gastromiaKit/buttons/primaryButton';

import { ReactComponent as GastromiaLogo } from '../../assets/gastromia-logo@24px.svg';
import { ReactComponent as CalendarIcon } from '../../assets/calendar@25px.svg';
import { ReactComponent as AddCardIcon } from '../../assets/card@25px.svg';
import { ReactComponent as RadioRestIcon } from '../../assets/radio-rest@20px.svg';
import { ReactComponent as RadioSelectedIcon } from '../../assets/radio-selected@20px.svg';
import { ReactComponent as ArrowDownIcon } from '../../assets/arrow-down@16px.svg';
import LocationPinIcon from '../../assets/icons/locationpin@24px.png';
import LocationPinGreenIcon from '../../assets/icons/locationpin-green@24px.png';
import ClockIcon from '../../assets/icons/clock@24px.png';
import ClockGreenIcon from '../../assets/icons/clock-green@24px.png';
import EditIcon from '../../assets/icons/edit@24px.png';
import EditGreenIcon from '../../assets/icons/edit-green@24px.png';
import PaymentCardIcon from '../../assets/icons/paymentcard@24px.png';
import PaymentCardGreenIcon from '../../assets/icons/paymentcard-green@24px.png';

const flatCart = (cart: CartItemSnapshot[]): CartItemSnapshot[] => {
  const flat: CartItemSnapshot[] = cart.flatMap((snapshot) =>
    Array(snapshot.quantity).fill(snapshot)
  );

  return flat;
};

const Checkout: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [updatingCards, setUpdatingCards] = useState<boolean>(false);
  const [address, _] = useState<string>('Via Ostiense 457D, Roma 00152');
  const [interval, setInterval] = useState<Interval | undefined>();
  const [timePickerIsOpen, setTimePickerIsOpen] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<string | undefined>();
  const [card, setCard] = useState<Card | undefined>();
  const [cash, setCash] = useState<boolean>(false);
  const [setupPaymentIsOpen, setSetupPaymentIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const user = useSelector(selectCurrentUser);
  const cart = useSelector(selectCart);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const stripe = useStripe();

  const updateCards = async () => {
    setUpdatingCards(true);
    const cards = await fetchCards();
    if (cards) {
      setCards(cards);
    }

    setUpdatingCards(false);
  };

  useEffect(() => {
    updateCards();
  }, []);

  useEffect(() => {
    if (user === null) {
      navigate('/');
    }
  }, [user]);

  const onSubmit = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const response = await createOrder({
      items_snapshot: cart,
      interval: `${interval?.start}-${interval?.end}`,
      cash_payment: cash,
      card_payment: card !== undefined,
      card_payment_method: card ? card.id : '',
    });

    if (
      // Order is paid in cash
      response &&
      response.order_id &&
      response.order_status === 'submitted'
    ) {
      setIsNavigating(true);
      navigate('/orders');
      dispatch(updateCart({ included: [], excluded: [] }));
      dispatch(updateRemoteSnapshot());
    } else if (
      // Order is paid by card
      response &&
      response.order_id &&
      response.order_status === 'pending' &&
      response.client_secret &&
      card
    ) {
      // Confirm card payment
      const result = await stripe?.confirmCardPayment(response.client_secret, {
        payment_method: card.id,
      });

      if (
        result &&
        result.paymentIntent &&
        result.paymentIntent.status === 'succeeded'
      ) {
        // Card payment successfull
        // update the backend
        const orderUpdate = await updatePaidOrder(
          result.paymentIntent.id,
          response.order_id
        );

        if (orderUpdate.success) {
          setIsNavigating(true);
          navigate('/orders');
          dispatch(updateCart({ included: [], excluded: [] }));
          dispatch(updateRemoteSnapshot());
        } else {
          dispatch(
            setToastState({
              isOpen: true,
              message:
                "Non siamo riusciti ad aggiornare l'ordine, contatta il servizio clienti",
            })
          );
        }
      } else {
        dispatch(
          setToastState({
            isOpen: true,
            message: 'Il pagamento non è andato a buon fine',
          })
        );
      }
    } else if (response && response.included && response.excluded) {
      dispatch(
        setToastState({
          isOpen: true,
          message: 'Ci sono stati problemi con il tuo carrello',
        })
      );
      dispatch(
        updateCart({ included: response.included, excluded: response.excluded })
      );
      dispatch(updateRemoteSnapshot());

      if (!response.included.length) {
        navigate('/');
      }
    } else {
      dispatch(
        setToastState({
          isOpen: true,
          message: "Ops.. Non siamo riusciti a completare l'operazione",
        })
      );
    }

    setIsLoading(false);
  };

  if ((user === null || !cart.length) && !isNavigating) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="checkout">
      <div className="checkout-header" onClick={() => navigate('/')}>
        <GastromiaLogo className="checkout-header-logo" />
      </div>

      <div className="checkout-content">
        <div className="checkout-modeselector-content">
          <div className="checkout-modeselector-pickup-content">
            <span className="checkout-modeselector-pickup-title">Pickup</span>
            <span className="checkout-modeselector-pickup-subtitle">
              Attivo • Dalle 11:00
            </span>
          </div>
        </div>

        <div className="checkout-selectors">
          <CheckoutSelectorButton
            isEnabled={false}
            options={{
              title: 'Gastromia Ostiense',
              subtitle: address,
              iconRest: LocationPinIcon,
              iconSelected: LocationPinGreenIcon,
            }}
          >
            <></>
          </CheckoutSelectorButton>

          <CheckoutSelectorButton
            isEnabled={true}
            options={{
              title: 'Orario di pickup',
              subtitle: interval
                ? `${formatMinuteTime(interval.start)} - ${formatMinuteTime(
                    interval.end
                  )}`
                : "Scegli l'orario di ritiro",
              iconRest: ClockIcon,
              iconSelected: ClockGreenIcon,
            }}
          >
            <button
              className="checkout-selectors-timeselectorbtn"
              onClick={() => {
                setTimePickerIsOpen(true);
              }}
            >
              <CalendarIcon fill="#343538" />
              <div className="checkout-selectors-timeselectorbtn-info">
                <span className="checkout-selectors-timeselectorbtn-title">
                  Scegli una finestra di 15m
                </span>
                <span className="checkout-selectors-timeselectorbtn-subtitle">
                  A partire dalle 11:00
                </span>
              </div>
              <ArrowDownIcon
                fill="#BDBDBD"
                style={{ transform: 'rotateZ(-90deg)' }}
              />
            </button>
          </CheckoutSelectorButton>
          <CheckoutTimePickerModal
            isOpen={timePickerIsOpen}
            selectedInterval={interval}
            onClose={() => setTimePickerIsOpen(false)}
            onClick={(interval) => {
              setInterval(interval);
            }}
          />

          <CheckoutSelectorButton
            isEnabled={true}
            options={{
              title: 'Istruzioni aggiuntive',
              subtitle: instructions
                ? instructions
                : "Aggiungi istruzioni per l'ordine",
              iconRest: EditIcon,
              iconSelected: EditGreenIcon,
            }}
          >
            <div className="checkout-selectors-instructionselector">
              <textarea
                className="checkout-selectors-instructionselector-input"
                placeholder="Aggiungi istruzioni per l'ordine (opzionale)"
                onChange={(event) => setInstructions(event.target.value)}
              />
            </div>
          </CheckoutSelectorButton>

          <CheckoutSelectorButton
            isEnabled={true}
            options={{
              title: 'Pagamento',
              subtitle: card
                ? `${card.brand.toUpperCase()} *${card.last4}`
                : cash
                ? 'Pagamento in contanti'
                : 'Seleziona un metodo di pagamento',
              iconRest: PaymentCardIcon,
              iconSelected: PaymentCardGreenIcon,
            }}
          >
            {updatingCards ? (
              <div className="checkout-selectors-paymentselector-skeletoncard">
                <Skeleton className="checkout-selectors-paymentselector-skeletoncard-skeleton1" />
                <Skeleton className="checkout-selectors-paymentselector-skeletoncard-skeleton2" />
              </div>
            ) : (
              <React.Fragment>
                {cards.map((thisCard, idx) => (
                  <button
                    className="checkout-selectors-paymentselector-paymentbtn"
                    onClick={() => {
                      setCard(thisCard);
                      setCash(false);
                    }}
                    key={idx}
                  >
                    {card && card.id === thisCard.id ? (
                      <RadioSelectedIcon />
                    ) : (
                      <RadioRestIcon />
                    )}
                    <span className="checkout-selectors-paymentselector-paymentbtn-card">{`💳 ${thisCard.brand.toUpperCase()} *${
                      thisCard.last4
                    }`}</span>

                    <span className="checkout-selectors-paymentselector-paymentbtn-expiry">{`Exp. ${thisCard.exp_month}/${thisCard.exp_year}`}</span>
                  </button>
                ))}
              </React.Fragment>
            )}

            <button
              className="checkout-selectors-paymentselector-paymentbtn"
              onClick={() => {
                setCash(true);
                setCard(undefined);
              }}
            >
              {cash ? <RadioSelectedIcon /> : <RadioRestIcon />}
              <span className="checkout-selectors-paymentselector-paymentbtn-card">
                💶 Contanti
              </span>
            </button>

            <button
              className="checkout-selectors-paymentselector-addcardbtn"
              onClick={() => {
                setSetupPaymentIsOpen(true);
              }}
            >
              <AddCardIcon fill="#343538" />

              <span className="checkout-selectors-paymentselector-addcardbtn-title">
                Aggiungi una carta
              </span>

              <ArrowDownIcon
                fill="#BDBDBD"
                style={{ transform: 'rotateZ(-90deg)' }}
              />
            </button>
          </CheckoutSelectorButton>

          <SetupPaymentModal
            isOpen={setupPaymentIsOpen}
            onClose={() => {
              setSetupPaymentIsOpen(false);
              updateCards();
            }}
          />

          <div className="checkout-selecteditems-content">
            <span className="checkout-selecteditems-heading">{`${cartCount} ${
              cartCount > 1 ? 'prodotti' : 'prodotto'
            }`}</span>
            <div className="checkout-selecteditems-items-content">
              {flatCart(cart).map((snapshot, idx) => (
                <img
                  className="checkout-selecteditems-item-img"
                  src={snapshot.preview_url}
                  key={idx}
                />
              ))}
            </div>
          </div>

          <div className="checkout-receipt">
            <div className="checkout-receipt-content">
              <div className="checkout-receipt-entry-content">
                <span className="checkout-receipt-entry-name">Prodotti</span>
                <span className="checkout-receipt-entry-value">{`€ ${(
                  cartTotal / 1000
                ).toFixed(2)}`}</span>
              </div>

              <div className="checkout-receipt-entry-content">
                <span className="checkout-receipt-entry-name">Pickup</span>
                <span className="checkout-receipt-entry-value">FREE</span>
              </div>

              <div className="checkout-receipt-entry-content">
                <span className="checkout-receipt-entry-name">EST. IVA</span>
                <span className="checkout-receipt-entry-value">{`€ ${(
                  (cartTotal * 0.1) /
                  1000
                ).toFixed(2)}`}</span>
              </div>

              <hr className="checkout-receipt-break" />

              <div className="checkout-receipt-entry-content">
                <span className="checkout-receipt-entry-name">Totale</span>
                <span
                  className="checkout-receipt-entry-value"
                  style={{ fontWeight: 700 }}
                >{`€ ${(cartTotal / 1000).toFixed(2)}`}</span>
              </div>
            </div>

            <div className="checkout-receipt-disclaimer">
              <span>
                Una tassa per il packaging extra potrebbe essere aggiunta al
                totale dell'ordine. La tassa sarà visibile/richiesta al momento
                del ritiro dell'ordine.
              </span>

              <span>
                I prezzi potrebbero variare rispetto a quelli in negozio.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-submit-content">
        <PrimaryButton
          onClick={onSubmit}
          options={{
            title: 'Conferma',
            isEnabled: interval !== undefined && (card !== undefined || cash),
            isLoading: isLoading,
            isVisible: true,
          }}
        />
      </div>
    </div>
  );
};

export default Checkout;
