import React, { useEffect, useState, useCallback } from "react";
import { v4 as uuid4 } from "uuid";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./app/storeSlices/authSlice";
import "./App.css";

import { getUser } from "./app/services/gastromiaApi";

import Header from "./features/header/header";
import CompressHeader from "./features/header/compressHeader";
import Store from "./features/store/store";
import ItemPage from "./features/itemPage/itemPage";
import useLocalStorage from "./utils/useLocalStorage";

function App() {
  const [value, setValue] = useLocalStorage("guest");
  const dispatch = useDispatch();

  const getUserOnLoad = useCallback(async () => {
    const result = await getUser();

    if (result.user) {
      dispatch(setCredentials({ user: result.user }));
    } else {
      dispatch(setCredentials({ user: null }));

      // Set a unique identifier for the user
      if (value === null) {
        setValue(uuid4());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    getUserOnLoad();
  }, [getUserOnLoad]);

  return (
    <div className="App">
      <CompressHeader />
      <Header />
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/items/:id" element={<ItemPage />} />
      </Routes>
    </div>
  );
}

export default App;
