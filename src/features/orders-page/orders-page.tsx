import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchOrders } from "../../app/services/order-api";
import { selectCurrentUser } from "../../app/store-slices/auth-slice";
import { Order } from "../../models/order";
import OrderPageOrder from "./orders-page-order";
import OrdersPageSkeleton from "./orders-page-skeleton";
import "./orders-page.css";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[] | undefined>();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const fetch = async () => {
      const orders = await fetchOrders();

      if (orders) {
        setOrders(orders.filter((order) => order.status !== "pending"));
      }
    };

    fetch();

    const interval = setInterval(fetch, 20000);

    return () => clearInterval(interval);
  }, []);

  // User might refresh to get order updates
  if (user === null) {
    return <Navigate to="/" replace />;
  }

  if (!orders || !user) {
    return <OrdersPageSkeleton />;
  }

  return (
    <div className="orderspage">
      <div className="orderspage-header">
        <h2 className="orderspage-header-heading">I tuoi ordini</h2>
      </div>
      {orders
        .sort((a, b) => {
          const aDate = new Date(a.created_at);
          const bDate = new Date(b.created_at);

          if (aDate < bDate) {
            return 1;
          }

          if (aDate > bDate) {
            return -1;
          }

          return 0;
        })
        .map((order, idx) => (
          <OrderPageOrder order={order} key={idx} />
        ))}
    </div>
  );
};

export default OrdersPage;
