import React from "react";
import { Item } from "../../models/item";
import "./item-page-price.css";

const ItemPagePrice: React.FC<{
  item: Item;
  total: number;
  showExtView: boolean;
}> = ({ item, total, showExtView }) => {
  return (
    <div className="itempage-itemprice-content">
      {item.quick_add ? (
        <span
          className="itempage-itemprice"
          style={item.discount ? { color: "#D43684" } : {}}
        >
          €
          {((item.discount ? item.discount_price : item.price) / 1000).toFixed(
            2
          )}
        </span>
      ) : (
        <span
          className="itempage-itemprice"
          style={item.discount ? { color: "#D43684" } : {}}
        >
          {showExtView ? (
            <span style={{ marginRight: "4px" }}>Totale</span>
          ) : null}
          €{(total / 1000).toFixed(2)}
        </span>
      )}

      {item.discount && (!showExtView || item.quick_add) ? (
        <>
          <span className="itempage-itemdiscount">
            €{item.discount ? (item.price / 1000).toFixed(2) : ""}
          </span>
          <span className="itempage-itemdiscount-tag">
            {item.discount_label}
          </span>
        </>
      ) : null}
    </div>
  );
};

export default ItemPagePrice;
