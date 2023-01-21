import React from "react";
import "./attribute-picker-button.css";

import { ReactComponent as PlusIcon } from "../../../assets/plus@20px.svg";
import { ReactComponent as TrashIcon } from "../../../assets/trash@20px.svg";
import { ReactComponent as MinusIcon } from "../../../assets/minus@20px.svg";

export enum AttributePickerButtonAction {
  Add,
  Remove,
}

const AttributePickerButton: React.FC<{
  count: number;
  onClick: (action: AttributePickerButtonAction) => void;
}> = ({ count, onClick }) => {
  return (
    <div>
      {count > 0 ? (
        <div className="attributepickerbutton-extended-content">
          <button
            className="attributepickerbutton-extended-removebtn"
            onClick={() => onClick(AttributePickerButtonAction.Remove)}
          >
            {count > 1 ? (
              <MinusIcon fill="#343537" style={{ marginLeft: "3px" }} />
            ) : (
              <TrashIcon fill="#343537" style={{ marginLeft: "3px" }} />
            )}
          </button>
          <span className="attributepickerbutton-extended-count">{count}</span>
          <button
            className="attributepickerbutton-extended-addbtn"
            onClick={() => onClick(AttributePickerButtonAction.Add)}
          >
            <PlusIcon fill="#343537" style={{ marginRight: "3px" }} />
          </button>
        </div>
      ) : (
        <button
          className="attributepickerbutton-previewbtn"
          onClick={() => onClick(AttributePickerButtonAction.Add)}
        >
          <PlusIcon fill="#343537" />
        </button>
      )}
    </div>
  );
};

export default AttributePickerButton;
