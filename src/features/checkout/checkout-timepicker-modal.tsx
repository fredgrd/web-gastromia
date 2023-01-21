import React from "react";
import { AnimatePresence } from "framer-motion";
import ReactPortal from "../reactPortal/reactPortal";
import { motion } from "framer-motion";
import "./checkout-timepicker-modal.css";

import { ReactComponent as Close } from "../../assets/close@20px.svg";
import { ReactComponent as RadioRest } from "../../assets/radio-rest@20px.svg";
import { ReactComponent as RadioSelected } from "../../assets/radio-selected@20px.svg";
import { ReactComponent as NotFoundIcon } from "../../assets/not-found@150px.svg";
import computeIntervals from "../../utils/computeIntervals";
import formatMinuteTime from "../../utils/formatMinuteTime";

const CheckoutTimePickerModal: React.FC<{
  isOpen: boolean;
  selectedInterval: { start: number; end: number } | undefined;
  onClose: () => void;
  onClick: (interval: { start: number; end: number }) => void;
}> = ({ isOpen, selectedInterval, onClose, onClick }) => {
  const date = new Date();
  const minuteTime = date.getHours() * 60 + date.getMinutes();
  const intervals = computeIntervals(minuteTime);

  return (
    <ReactPortal wrapperId="portal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="checkouttimepicker-modal"
          >
            <div className="checkouttimepicker-modal-header">
              <div className="checkouttimepicker-modal-icon">
                <button className="icon-btn" onClick={onClose}>
                  <Close />
                </button>
              </div>
              <h2 className="checkouttimepicker-modal-heading">
                Orario di pickup
              </h2>
            </div>

            <div className="checkouttimepicker-modal-intervals">
              {intervals.map((interval, idx) => {
                return (
                  <div
                    className="checkouttimepicker-modal-interval-content"
                    key={idx}
                    onClick={() => {
                      onClick(interval);
                      onClose();
                    }}
                  >
                    {selectedInterval &&
                    selectedInterval.start === interval.start &&
                    selectedInterval.end === interval.end ? (
                      <RadioSelected />
                    ) : (
                      <RadioRest />
                    )}
                    <span className="checkouttimepicker-modal-interval">{`${formatMinuteTime(
                      interval.start
                    )} - ${formatMinuteTime(interval.end)}`}</span>
                    <span className="checkouttimepicker-modal-free">FREE</span>
                  </div>
                );
              })}
            </div>

            {!intervals.length && (
              <div className="checkouttimepicker-modal-closed">
                <NotFoundIcon />
                <span className="checkouttimepicker-modal-closed-heading1">
                  Ops.. Siamo chiusi al momento
                </span>
                <span className="checkouttimepicker-modal-closed-heading2" style={{marginTop: "16px"}}>
                  I nostri orari sono:
                </span>
                <span className="checkouttimepicker-modal-closed-heading2">
                  LUN-VEN 11:00-16:00
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ReactPortal>
  );
};

export default CheckoutTimePickerModal;
