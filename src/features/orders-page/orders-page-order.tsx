import React, { useState } from "react";
import { Order, statusToColor, statusToPct } from "../../models/order";
import { CartItemSnapshot } from "../../models/cart-snapshot";
import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";
import "./orders-page-order.css";

import { ReactComponent as ArrowDownIcon } from "../../assets/arrow-down@16px.svg";
import OrdersPageOrderModal from "./orders-page-order-modal";

const flatCart = (cart: CartItemSnapshot[]): CartItemSnapshot[] => {
  const flat: CartItemSnapshot[] = cart.flatMap((snapshot) =>
    Array(snapshot.quantity).fill(snapshot)
  );

  return flat;
};

const OrdersPageOrder: React.FC<{ order: Order }> = ({ order }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const count = order.items.reduce((acc, curr) => acc + curr.quantity, 0);
  const hiddenStatus = ["rejected", "refunded", "completed"];

  return (
    <React.Fragment>
      <div className="orderspageorder" onClick={() => setShowModal(true)}>
        {!hiddenStatus.includes(order.status) && (
          <div className="orderspageorder-orderstatus-progressbar">
            <div
              className="orderspageorder-orderstatus-progressbar-progress"
              style={{
                width: `${statusToPct(order.status)}%`,
                backgroundColor: statusToColor(order.status),
              }}
            ></div>
          </div>
        )}

        <div className="orderspageorder-header">
          <div className="orderspageorder-header-info">
            <span className="orderspageorder-header-info-code">{`Ordine nº ${order.code}`}</span>
            <span className="orderspageorder-header-info-timedate">{`${formatDate(
              order.created_at,
              "dd-mmmm-yyyy"
            )} • ${formatTime(order.created_at)}`}</span>
          </div>

          <ArrowDownIcon
            fill="#BDBDBD"
            style={{ transform: "rotateZ(-90deg)" }}
          />
        </div>

        <div className="orderspageorder-products">
          <span className="orderspageorder-products-info">{`${count} ${
            count > 1 ? "prodotti" : "prodotto"
          } • €${(order.total / 1000).toFixed(2)}`}</span>
          <div className="orderspageorder-products-content">
            {flatCart(order.items).map((item, idx) => (
              <img
                className="orderspageorder-product"
                src={item.preview_url}
                key={idx}
              />
            ))}
          </div>
        </div>
      </div>

      <OrdersPageOrderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        order={order}
      />
    </React.Fragment>
  );
};

export default OrdersPageOrder;
