import React from "react";
import { Link } from "react-router-dom";
import { Item } from "../../models/item";
import capitalizeWord from "../../utils/capitalizeWord";
import formatPrice from "../../utils/formatPrice";
import "./item-card.css";

import { ReactComponent as TagsIcon } from "../../assets/tags@14px.svg";
import ItemCardPickerAddButton from "./item-card-picker-add-button";

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <div className="itemcard-content">
      <Link
        className={!item.available ? "itemcard-content-notavailable" : ""}
        to={`items/${item._id}`}
      >
        <div
          className={`itemcard-image-content ${
            !item.available ? "itemcard-image-content-notavailable" : ""
          }`}
        >
          <img className="itemcard-image" src={item.media_url} />
          {item.discount ? (
            <div className="itemcard-image-discounttag">
              <span>{item.discount_label}</span>
            </div>
          ) : null}
        </div>
        <div className="itemcard-price-content">
          <div
            className={`itemcard-pricetag ${
              item.discount ? "pricetag-discount" : ""
            }`}
          >
            <span>€</span>
            <span className="itemcard-pricetag-whole">
              {item.discount
                ? formatPrice(item.discount_price).whole
                : formatPrice(item.price).whole}
            </span>
            <span className="itemcard-pricetag-fractional">
              {item.discount
                ? formatPrice(item.discount_price).fractional
                : formatPrice(item.price).fractional}
            </span>
          </div>
          {item.discount ? (
            <div className="itemcard-pricetag-originalprice-content">
              <span className="itemcard-pricetag-originalprice">
                €{(item.price / 1000).toFixed(2)}
              </span>
            </div>
          ) : null}
        </div>
        <span className="itemcard-name">{item.name}</span>

        <div className="itemcard-tags-content">
          <TagsIcon style={{ flexShrink: "0" }} fill="#00B172" />
          <span className="itemcard-tags">
            {item.tags.map((tag) => capitalizeWord(tag)).join(", ")}
          </span>
        </div>
      </Link>

      {item.quick_add && item.available ? (
        <ItemCardPickerAddButton item={item} />
      ) : null}

      {!item.available ? (
        <div className="itemcard-notavailable-tag-content">
          <span className="itemcard-notavailable-tag">Non disponibile</span>
        </div>
      ) : null}
    </div>
  );
};

export default ItemCard;
