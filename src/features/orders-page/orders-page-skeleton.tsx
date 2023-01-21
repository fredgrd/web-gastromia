import React from "react";
import "./orders-page-skeleton.css";

import Skeleton from "../skeleton/skeleton";

const OrdersPageSkeleton: React.FC = () => {
  return (
    <div className="orderspage-skeleton">
      <Skeleton className="orderspage-skeleton-header" />
      <Skeleton className="orderspage-skeleton-order" />
      <Skeleton className="orderspage-skeleton-order" />
    </div>
  );
};

export default OrdersPageSkeleton;
