import React from "react";
import "./drawerIcon.css";

export interface DrawerIconPropsType {
  selected: boolean;
}

export const DrawerIcon = ({ selected = false }: DrawerIconPropsType) => {
  const fill = selected ? "#343537" : "#FFF";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drawericon"
    >
      <rect x="3.5" y="3.5" width="17" height="3" rx="1.5" fill={fill} />
      <rect x="3.5" y="10.5" width="17" height="3" rx="1.5" fill={fill} />
      <rect x="3.5" y="17.5" width="17" height="3" rx="1.5" fill={fill}  />
    </svg>
  );
};
