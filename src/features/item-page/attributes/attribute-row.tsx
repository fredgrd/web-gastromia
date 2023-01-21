import React from "react";
import Context, { handleAdd, handleRemove } from "../item-page-context";
import { Attribute, AttributeGroupRules } from "../../../models/item";
import AttributePickerButton, {
  AttributePickerButtonAction,
} from "./attribute-picker-button";
import "./attribute-row.css";

const AttributeRow: React.FC<{
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

        const handleUpdate = (action: AttributePickerButtonAction) => {
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

        return (
          <div
            className="attributerow-content"
            style={!attribute.available ? { opacity: "0.3" } : {}}
          >
            <div>
              <span className="attributerow-name">{attribute.name}</span>
              {attribute.price > 0 ? (
                <span className="attributerow-price">{`€ ${(
                  attribute.price / 1000
                ).toFixed(2)}`}</span>
              ) : null}
            </div>
            <AttributePickerButton
              count={attributeSnapshot.quantity}
              onClick={handleUpdate}
            />
          </div>
        );
      }}
    </Context.Consumer>
  );
};

export default AttributeRow;
