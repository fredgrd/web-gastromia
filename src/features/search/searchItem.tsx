import React from "react";
import { Item } from "../../models/item";
import "./searchItem.css";

const SearchItem: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <a className="searchitem-content">
      <img className="searchitem-image" src={item.preview_url} />
      <div className="searchitem-infos">
        <span className="searchitem-name">{item.name}</span>

        <div className="searchitem-priceanddiscount">
          <div className="searchitem-price-content">
            <span className="searchitem-price">{`${(item.price / 1000).toFixed(
              2
            )} €`}</span>
          </div>

          {item.discount ? (
            <div className="searchitem-discount-content">
              <span className="searchitem-discount-price">
                {`${(item.discount_price / 1000).toFixed(2)} €`}
              </span>
              <div className="searchitem-discount-tag">
                <span className="searchitem-discount-tag-title">
                  {item.discount_label}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
};

export default SearchItem;
