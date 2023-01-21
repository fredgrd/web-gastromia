import React from "react";
import "./skeleton.css";

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={`skeleton-content ${className ? className : ""}`} />;
};

export default Skeleton;
