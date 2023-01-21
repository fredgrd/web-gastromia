import React from "react";
import Context, {
  handleSelect,
  handleAdd,
  handleRemove,
} from "../item-page-context";
import { Attribute, AttributeGroupRules } from "../../../models/item";
import "./attribute-card.css";

import { ReactComponent as CheckIcon } from "../../../assets/check@20px.svg";
import AdditionPickerButton, {
  AttributePickerButtonAction,
} from "./attribute-picker-button";

const AttributeCard: React.FC<{
  groupID: string;
  attribute: Attribute;
  rules: AttributeGroupRules;
}> = ({ groupID, attribute, rules }) => {
  return (
    <Context.Consumer>
      {({ attributeSnapshots, updateContext }) => {
        const groupSnapshots = attributeSnapshots.get(groupID);
        const attributeSnapshot = groupSnapshots?.get(attribute._id);

        if (!groupSnapshots || !attributeSnapshot) {
          return null;
        }

        const handleUpdateWithAddRemove = (
          action: AttributePickerButtonAction
        ) => {
          if (!attribute.available) {
            return;
          }

          switch (action) {
            case AttributePickerButtonAction.Add:
              const updatedSnapshotsWithAdd = handleAdd(
                attributeSnapshots,
                groupSnapshots,
                attributeSnapshot,
                groupID,
                attribute._id,
                rules
              );

              updateContext({
                attributeSnapshots: updatedSnapshotsWithAdd,
                updateContext,
              });
              break;
            case AttributePickerButtonAction.Remove:
              const updatedSnapshotsWithRemove = handleRemove(
                attributeSnapshots,
                groupSnapshots,
                attributeSnapshot,
                groupID,
                attribute._id,
                rules
              );

              updateContext({
                attributeSnapshots: updatedSnapshotsWithRemove,
                updateContext,
              });
              break;
          }
        };

        const handleUpdateWithSelect = () => {
          if (!attribute.available) {
            return;
          }

          const updatedSnapshots = handleSelect(
            attributeSnapshots,
            groupSnapshots,
            attributeSnapshot,
            groupID,
            attribute._id,
            rules
          );

          updateContext({
            attributeSnapshots: updatedSnapshots,
            updateContext,
          });
        };

        return (
          <div
            className="attributecard-content"
            onClick={handleUpdateWithSelect}
            style={!attribute.available ? { opacity: "0.3" } : {}}
          >
            <img
              className="attributecard-image"
              src={attribute.media_url}
              alt=""
            />
            {attribute.price > 0 ? (
              <span className="attributecard-price">{`€ ${(
                attribute.price / 1000
              ).toFixed(2)}`}</span>
            ) : null}
            <span className="attributecard-name">{attribute.name}</span>
            {rules.attribute_max > 1 ? (
              <div className="attributecard-pickerbtn">
                <AdditionPickerButton
                  count={attributeSnapshot.quantity}
                  onClick={handleUpdateWithAddRemove}
                />
              </div>
            ) : attributeSnapshot!.quantity > 0 ? (
              <div className="attributecard-selecticon">
                <CheckIcon fill="#343537" />
              </div>
            ) : null}
          </div>
        );
      }}
    </Context.Consumer>
  );
};

export default AttributeCard;
