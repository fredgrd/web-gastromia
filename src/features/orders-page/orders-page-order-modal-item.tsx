import React from "react";
import { CartItemSnapshot } from "../../models/cart-snapshot";
import "./orders-page-order-modal-item.css";

const OrdersPageOrderModalItem: React.FC<{ item: CartItemSnapshot }> = ({
  item,
}) => {
  return (
    <div className="orderspageordermodal-item">
      <div className="orderspageordermodal-count-content">
        <span className="orderspageordermodal-count">{item.quantity}</span>
      </div>

      <div className="orderspageordermodal-item-content">
        <div className="orderspageordermodal-item-info">
          <img
            className="orderspageordermodal-item-img"
            src={item.preview_url}
            alt=""
          />
          <span className="orderspageordermodal-item-name">{item.name}</span>
        </div>

        <div className="orderspageordermodal-item-attributes">
          {item.attributes_snapshot.map((attribute, idx) => {
            return (
              <div className="orderspageordermodal-item-attribute" key={idx}>
                <span className="orderspageordermodal-item-attribute-name">
                  {`${attribute.name}${
                    attribute.quantity > 1 ? ` x${attribute.quantity}` : ""
                  }`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPageOrderModalItem;
