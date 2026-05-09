import React from "react";

const HexIcon = ({ className = "", fill = "currentColor" }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l9.5 5.5v11L12 24l-9.5-5.5v-11z" fill={fill} />
  </svg>
);

export default HexIcon;
