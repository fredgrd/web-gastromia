import React from "react";
import { Item } from "../../app/services/gastromiaApi";
import capitalizeWord from "../../utils/capitalizeWord";
import "./itemCard.css";

import { ReactComponent as TagsIcon } from "../../assets/tags@14px.svg";

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <div className="itemcard-content">
      <div className="itemcard-image-content">
        <img className="itemcard-image" src={item.media_url} />
      </div>
      <span className="itemcard-name">{item.name}</span>

      <div className="itemcard-tags-content">
        <TagsIcon style={{ flexShrink: "0" }} />
        <span className="itemcard-tags">
          {item.tags.map((tag) => capitalizeWord(tag)).join(", ")}
        </span>
      </div>
    </div>
  );
};

export default ItemCard;
