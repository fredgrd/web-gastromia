import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./features/auth/authSlice";
import "./App.css";

import { getUser } from "./app/services/gastromiaApi";

import Header from "./features/header/header";
import CompressHeader from "./features/header/compressHeader";
import Store from "./features/store/store";

function App() {
  const dispatch = useDispatch();

  const getUserOnLoad = useCallback(async () => {
    const result = await getUser();

    if (result.user) {
      dispatch(setCredentials({ user: result.user }));
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
        <Route
          path="/items/:id"
          element={
            <div style={{ backgroundColor: "red", height: "200px" }}></div>
          }
        />
      </Routes>
      <button
        style={{ height: "60px", width: "60px" }}
        onClick={() => {
          window.history.pushState(null, "Item", "/items/aja");
        }}
      ></button>
    </div>
  );
}

export default App;
