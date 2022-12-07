import React, { useState } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { useGetUserQuery } from "./app/services/gastromia";
import { setCredentials } from "./features/auth/authSlice";

import Header from "./features/header";
import AuthModal from "./features/auth/authModal";

function App() {
  const dispatch = useDispatch();
  const { data, error } = useGetUserQuery();
  const [authModal, setAuthModal] = useState<boolean>(true);

  console.log(error);

  if (data) {
    dispatch(setCredentials({ user: data }));
  }

  return (
    <div className="App">
      <Header />
      <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />
    </div>
  );
}

export default App;
