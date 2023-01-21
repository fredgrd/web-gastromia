import React from "react";
import Context, { handleSelect } from "../item-page-context";
import { Attribute, AttributeGroupRules } from "../../../models/item";
import "./attribute-tag.css";

const AttributeTag: React.FC<{
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

        const handleUpdate = () => {
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
          <button
            className={`attributetag-content ${
              attributeSnapshot && attributeSnapshot.quantity > 0
                ? "attributetag-content-selected"
                : ""
            }`}
            style={!attribute.available ? { opacity: "0.3" } : {}}
            onClick={handleUpdate}
          >
            <span className="attributetag-title">{attribute.name}</span>
            {attribute.price > 0 ? (
              <span className="attributetag-price">
                {`€ ${(attribute.price / 1000).toFixed(2)}`}
              </span>
            ) : null}
          </button>
        );
      }}
    </Context.Consumer>
  );
};

export default AttributeTag;
