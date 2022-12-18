import React, { useEffect, useState } from "react";
import { Item, fetchCategoryItems } from "../../app/services/gastromiaApi";
import "./storeSection.css";

import ItemCard from "../itemCard/itemCard";

const StoreSection: React.FC<{ title: string; category: string }> = ({
  title,
  category,
}) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchCategoryItems(category);

      if (result.items && result.items.length) {
        setItems(result.items);
      } else {
        setItems([]);
      }

      //   setIsLoading(false);
    };

    fetch();
  }, []);

  return (
    <div className="storesection-content">
      <h2 className="storesection-sectiontitle">{title}</h2>
      <div className="storesection-items-content">
        {items.map((item) => {
          return <ItemCard item={item} />;
        })}
      </div>
    </div>
  );
};

export default StoreSection;
