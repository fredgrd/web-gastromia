import React, { useEffect, useState } from "react";
import { Item } from "../../models/item";
import { fetchCategory } from "../../app/services/item-api";
import "./storeSection.css";

import ItemCard from "../itemCard/itemCard";
import Skeleton from "../skeleton/skeleton";

const SectionSkeleton = () => {
  return (
    <div className="storesectionskeleton-content">
      <Skeleton className="storesectionskeleton-header" />
      <div className="storesectionskeleton-itemcards-content">
        {[1, 2, 3].map((_, idx) => {
          return (
            <div className="storesectionskeleton-itemcard-content" key={idx}>
              <Skeleton className="storesectionskeleton-itemcard-img" />
              <Skeleton className="storesectionskeleton-itemcard-header1" />
              <Skeleton className="storesectionskeleton-itemcard-header2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StoreSection: React.FC<{ title: string; category: string }> = ({
  title,
  category,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      const items = await fetchCategory(category);

      if (items) {
        setItems(items);
        setIsLoading(false);
      } else {
        setItems([]);
      }
    };

    fetch();
  }, []);

  if (isLoading) {
    return <SectionSkeleton />;
  }

  return (
    <div className="storesection-content">
      <h2 className="storesection-sectiontitle">{title}</h2>
      <div className="storesection-items-content">
        {items.map((item) => {
          return <ItemCard item={item} key={item._id} />;
        })}
      </div>
    </div>
  );
};

export default StoreSection;
