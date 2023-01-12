import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./app/store";
import { fetchRemoteUser } from "./app/store-slices/auth-slice";
import { fetchRemoteSnapshot } from "./app/store-slices/cart-slice";
import "./App.css";

import Header from "./features/header/header";
import CompressHeader from "./features/header/compressHeader";
import Store from "./features/store/store";
import ItemPage from "./features/item-page/item-page";
import ExcludedItemsModal from "./features/cart/excludedItemsModal";
import AuthModal from "./features/auth/authModal/authModal";
import Toast from "./features/toast/toast";
import Checkout from "./features/checkout/checkout";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_MVxV52uGwe6eYy4DjyPoJIkF005npSloTk");

function App() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRemoteUser());
    dispatch(fetchRemoteSnapshot());
  }, [dispatch]);

  return (
    <React.StrictMode>
      <Elements stripe={stripePromise}>
        <div className="App">
          {location.pathname !== "/checkout" ? (
            <React.Fragment>
              <CompressHeader />
              <Header />
            </React.Fragment>
          ) : null}
          <Routes>
            <Route path="/" element={<Store />} />
            <Route path="/items/:id" element={<ItemPage />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <ExcludedItemsModal />
          <AuthModal />
          <Toast />
        </div>
      </Elements>
    </React.StrictMode>
  );
}

export default App;
