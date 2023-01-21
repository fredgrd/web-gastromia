import React from "react";
import { AttributeGroup as AttributeGroupModel } from "../../../models/item";
import "./attribute-group.css";

import AttributeTag from "./attribute-tag";
import AttributeRow from "./attribute-row";
import AttributeCard from "./attribute-card";

const AttributeGroup: React.FC<{
  group: AttributeGroupModel;
}> = ({ group }) => {
  return (
    <>
      <div className="additiongroup-content" id={`attributegroup-${group._id}`}>
        <span className="additiongroup-title">{group.name}</span>
        <span className="additiongroup-description">{group.description}</span>
        <div
          className="additiongroup-additions-content"
          style={
            group.with_media
              ? { overflowX: "scroll", flexWrap: "nowrap" }
              : { overflowX: "hidden", flexWrap: "wrap" }
          }
        >
          {group.attributes.map((attribute) => {
            // Can select only one
            if (group.rules.group_max === 1 && group.with_media) {
              return (
                <AttributeCard
                  groupID={group._id}
                  attribute={attribute}
                  rules={group.rules}
                  key={group._id + attribute._id}
                />
              );
            }

            if (group.rules.group_max === 1 && !group.with_media) {
              return (
                <AttributeTag
                  groupID={group._id}
                  attribute={attribute}
                  rules={group.rules}
                  key={group._id + attribute._id}
                />
              );
            }

            // Select many
            if (
              group.rules.group_max >= 1 &&
              group.rules.attribute_max === 1 &&
              group.with_media
            ) {
              return (
                <AttributeCard
                  groupID={group._id}
                  attribute={attribute}
                  rules={group.rules}
                  key={group._id + attribute._id}
                />
              );
            }

            if (
              group.rules.group_max >= 1 &&
              group.rules.attribute_max === 1 &&
              !group.with_media
            ) {
              return (
                <AttributeTag
                  groupID={group._id}
                  attribute={attribute}
                  rules={group.rules}
                  key={group._id + attribute._id}
                />
              );
            }

            // Can add as many as wanted
            if (group.rules.attribute_max > 1 && group.with_media) {
              return (
                <AttributeCard
                  groupID={group._id}
                  attribute={attribute}
                  rules={group.rules}
                  key={group._id + attribute._id}
                />
              );
            }

            if (group.rules.attribute_max > 1 && !group.with_media) {
              return (
                <AttributeRow
                  groupID={group._id}
                  attribute={attribute}
                  rules={group.rules}
                  key={group._id + attribute._id}
                />
              );
            }

            return null; // Silences warnings
          })}
        </div>
      </div>

      <hr className="additiongroup-break-small" />
    </>
  );
};

export default AttributeGroup;
