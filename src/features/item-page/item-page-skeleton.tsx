import React from "react";
import Skeleton from "../skeleton/skeleton";

const ItemPageSkeleton: React.FC = () => {
  return (
    <div className="itempageskeleton-content">
      <Skeleton className="itempageskeleton-img" />
      <Skeleton className="itempageskeleton-name" />
      <Skeleton className="itempageskeleton-desc1" />
      <Skeleton className="itempageskeleton-desc2" />
    </div>
  );
};

export default ItemPageSkeleton;
