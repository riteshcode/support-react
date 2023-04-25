import React from "react";
import FeatherIcon from "feather-icons-react";

function ColorInfo() {
  return (
    <div className="col-md-12 mb-3">
      <span>
        <FeatherIcon icon="grid" color="blue" size={15} /> template component
        list
      </span>
      {"  "}
      <span>
        <FeatherIcon icon="toggle-left" color="red" size={15} /> Status : off
      </span>
      {"  "}
      <span>
        <FeatherIcon icon="toggle-right" color="green" size={15} /> Status : on
      </span>
      {"  "}
      <span>
        <FeatherIcon icon="eye-off" color="red" size={15} /> Quick Access : off
      </span>
      {"  "}
      <span>
        <FeatherIcon icon="eye" color="green" size={15} /> Quick Access : on
      </span>
    </div>
  );
}

export default ColorInfo;
