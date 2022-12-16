import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "./features/auth/authSlice";
import "./App.css";

import { getUser } from "./app/services/gastromiaApi";

import Header from "./features/header/header";
import AuthModal from "./features/auth/authModal/authModal";

function App() {
  const dispatch = useDispatch();
  const [authModal, setAuthModal] = useState<boolean>(true);

  const getUserOnLoad = useCallback(async () => {
    const result = await getUser();

    if (result.user) {
      dispatch(setCredentials({ user: result.user }));
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("I have fired once");

    getUserOnLoad();
  }, [getUserOnLoad]);

  return (
    <div className="App">
      <Header />
      {/* <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} /> */}
    </div>
  );
}

export default App;
