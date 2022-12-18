import React from "react";
import "./store.css";

import StoreSection from "./storeSection";

const Store: React.FC = () => {
  return (
    <div className="store-content">
      <div className="store-banner-content">
        <div className="store-banner"></div>
      </div>
      <StoreSection title="Poké" category="mains>poké" />
      <StoreSection title="Pita" category="mains>pita" />
    </div>
  );
};

export default Store;