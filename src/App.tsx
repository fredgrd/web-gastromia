import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRemoteUser());
    dispatch(fetchRemoteSnapshot());
  }, [dispatch]);

  return (
    <React.StrictMode>
      <div className="App">
        <CompressHeader />
        <Header />
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/items/:id" element={<ItemPage />} />
        </Routes>
        <ExcludedItemsModal />
        <AuthModal />
        <Toast />
      </div>
    </React.StrictMode>
  );
}

export default App;
