import React from "react";
import "./searchItem.css";

const SearchItem = () => {
  return (
    <a className="searchitem-content">
      <img
        className="searchitem-image"
        src="https://dzfokbljn6tmk.cloudfront.net/items/8350d4110970735-media.jpg"
      />
      <div className="searchitem-infos">
        <span className="searchitem-name">Pita Chicken</span>

        <div className="searchitem-priceanddiscount">
          <div className="searchitem-price-content">
            <span className="searchitem-price">6.50 €</span>
          </div>

          <div className="searchitem-discount-content">
            <span className="searchitem-discount-price">6.50 €</span>
            <div className="searchitem-discount-tag">
              <span className="searchitem-discount-tag-title">-20%</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default SearchItem;
