import React, { useEffect, useState } from "react";
import { fetchLocationStatus } from "../../app/services/location-api";
import "./store.css";

import StoreSection from "./storeSection";

const Store: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      const status = await fetchLocationStatus();

      setIsOpen(status);
    };

    fetch();
    const interval = setInterval(fetch, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="store-content">
      <div className="store-banner-content">
        <div className="store-banner">
          <img
            className="store-banner-img"
            src={`https://dzfokbljn6tmk.cloudfront.net/banners/${
              isOpen ? "location_open" : "location_closed"
            }.png`}
            alt="store-banner"
          />
        </div>
      </div>
      <StoreSection title="Poké" category="poké" />
      <StoreSection title="Crea il tuo Poké" category="Crea il tuo poké" />
      <StoreSection title="Salads" category="salads" />
      <StoreSection title="Pita" category="pita" />
      <StoreSection title="Mexican 🇲🇽" category="mexican" />
      <StoreSection title="Sides & Dips" category="sides" />
      <StoreSection title="Drinks" category="drinks" />
    </div>
  );
};

export default Store;
