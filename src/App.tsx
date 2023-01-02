import React, { useEffect, useCallback } from "react";
import { v4 as uuid4 } from "uuid";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./app/storeSlices/authSlice";
import "./App.css";

import { fetchUser } from "./app/services/userApi";

import Header from "./features/header/header";
import CompressHeader from "./features/header/compressHeader";
import Store from "./features/store/store";
import ItemPage from "./features/itemPage/itemPage";
import { fetchCartSnapshot } from "./app/services/cartApi";
import { update } from "./app/storeSlices/cartSlice";
import ExcludedItemsModal from "./features/cart/excludedItemsModal";

function App() {
  const dispatch = useDispatch();

  // Initial fetchings
  const fetchUserOnLoad = useCallback(async () => {
    const user = await fetchUser();

    if (user) {
      dispatch(setCredentials({ user: user }));
    } else {
      console.log("SETTING CREDENTIALS");
      dispatch(setCredentials({ user: null }));
    }
  }, [dispatch]);

  const fetchCartSnapshotOnLoad = useCallback(async () => {
    const snapshot = await fetchCartSnapshot();

    if (snapshot) {
      console.log("SNAPSHOT", snapshot);
      dispatch(
        update({ included: snapshot.included, excluded: snapshot.excluded })
      );
    } else {
      // SET EMPTY CART
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUserOnLoad();
  }, [fetchUserOnLoad]);

  useEffect(() => {
    fetchCartSnapshotOnLoad();
  }, [fetchCartSnapshotOnLoad]);

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
      </div>
    </React.StrictMode>
  );
}

export default App;
