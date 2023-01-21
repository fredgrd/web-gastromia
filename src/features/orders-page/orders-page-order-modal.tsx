import React, { useEffect } from "react";
import ReactPortal from "../reactPortal/reactPortal";
import { AnimatePresence, motion } from "framer-motion";
import { Order, statusToColor } from "../../models/order";
import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";
import { formatStatus, statusToPct } from "../../models/order";
import formatMinuteTime from "../../utils/formatMinuteTime";
import "./orders-page-order-modal.css";

import OrdersPageOrderModalItem from "./orders-page-order-modal-item";

import { ReactComponent as Close } from "../../assets/close@20px.svg";
import { ReactComponent as OrderIcon } from "../../assets/orders@24px.svg";

const OrdersPageOrderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}> = ({ isOpen, onClose, order }) => {
  const intervalSplit = order.interval.split("-");
  const hiddenStatus = ["rejected", "refunded", "completed"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isOpen]);

  return (
    <ReactPortal wrapperId="portal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="orderspageorder-modal"
          >
            <div className="orderspageorder-modal-header">
              <div className="orderspageorder-modal-icon">
                <button className="icon-btn" onClick={onClose}>
                  <Close />
                </button>
              </div>
              <h2 className="orderspageorder-modal-heading">{`Ordine nº ${order.code}`}</h2>
            </div>

            <div className="orderspageorder-modal-content">
              <div className="orderspageorder-modal-orderstatus">
                {!hiddenStatus.includes(order.status) && (
                  <div className="orderspageorder-modal-orderstatus-progressbar">
                    <div
                      className="orderspageorder-modal-orderstatus-progressbar-progress"
                      style={{
                        width: `${statusToPct(order.status)}%`,
                        backgroundColor: statusToColor(order.status),
                      }}
                    />
                  </div>
                )}
                <span
                  className="orderspageorder-modal-orderstatus-status"
                  style={{ color: statusToColor(order.status) }}
                >
                  {formatStatus(order.status)}
                </span>
                {!hiddenStatus.includes(order.status) && (
                  <span className="orderspageorder-modal-orderstatus-pickup">{`Ritiro: ${formatMinuteTime(
                    Number(intervalSplit[0])
                  )}-${formatMinuteTime(Number(intervalSplit[1]))}`}</span>
                )}
              </div>

              <div className="orderspageorder-modal-products">
                <span className="orderspageorder-modal-products-heading">
                  Dettagli ordine
                </span>

                <span className="orderspageorder-modal-products-timedate">
                  {`Del ${formatDate(
                    order.created_at,
                    "dd-mmmm-yyyy"
                  )} • ${formatTime(order.created_at)}`}
                </span>

                {order.items.map((item, idx) => (
                  <OrdersPageOrderModalItem item={item} key={idx} />
                ))}
              </div>

              <hr className="orderspageorder-modal-break" />

              <div className="orderspageorder-modal-recap">
                <div className="orderspageorder-modal-ordertotal">
                  <OrderIcon fill="#343537" />
                  <span className="orderspageorder-modal-ordertotal-total">{`Totale: €${(
                    order.total / 1000
                  ).toFixed(2)}`}</span>
                </div>

                {false && (
                  <button className="orderspageorder-modal-help">
                    Richiedi assistenza
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default OrdersPageOrderModal;
