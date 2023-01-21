import React, { useState } from "react";
import "./item-page-info.css";

import { ReactComponent as ArrowDownIcon } from "../../assets/arrow-down@12px.svg";

enum ItemInfoType {
  Details,
  Ingredients,
}

const ItemPageInfo: React.FC<{ details: string; ingredients: string }> = ({
  details,
  ingredients,
}) => {
  const [itemInfo, setItemInfo] = useState<ItemInfoType | null>(null);

  const onItemInfoClick = (info: ItemInfoType) => {
    if (itemInfo === info) {
      setItemInfo(null);
    } else {
      setItemInfo(info);
    }
  };

  return (
    <div className="itempage-iteminfo-content">
      <span className="itempage-iteminfo-title">Informazioni prodotto</span>
      <div className="itempage-iteminfo-buttons-content">
        {details.length ? (
          <button
            className={`itempage-iteminfo-btn ${
              itemInfo === ItemInfoType.Details
                ? "itempage-iteminfo-btn-active"
                : ""
            }`}
            onClick={() => onItemInfoClick(ItemInfoType.Details)}
          >
            <span className="itempage-iteminfo-btn-title">Dettagli</span>
            <ArrowDownIcon
              fill="#343537"
              style={
                itemInfo === ItemInfoType.Details
                  ? { transform: "rotateZ(180deg)" }
                  : {}
              }
            />
          </button>
        ) : null}
        {ingredients.length ? (
          <button
            className={`itempage-iteminfo-btn ${
              itemInfo === ItemInfoType.Ingredients
                ? "itempage-iteminfo-btn-active"
                : ""
            }`}
            onClick={() => onItemInfoClick(ItemInfoType.Ingredients)}
          >
            <span className="itempage-iteminfo-btn-title">Ingredienti</span>
            <ArrowDownIcon
              fill="#343537"
              style={
                itemInfo === ItemInfoType.Ingredients
                  ? { transform: "rotateZ(180deg)" }
                  : {}
              }
            />
          </button>
        ) : null}
      </div>
      {itemInfo !== null ? (
        <div className="itempage-iteminfo-extended-content">
          <span className="itempage-iteminfo-extended-title">
            {itemInfo === ItemInfoType.Details ? "Dettagli" : "Ingredienti"}
          </span>
          <p className="itempage-iteminfo-extended-infos">
            {itemInfo === ItemInfoType.Details ? details : ingredients}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ItemPageInfo;
