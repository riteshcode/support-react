import React from "react";
import FeatherIcon from "feather-icons-react";

function ColorInfo() {
  return (
    <div className="col-md-12 mb-3">
      <span>
        <FeatherIcon icon="circle" fill="#ff8d00" color="#ff8d00" size={20} />{" "}
        SuperAdmin
      </span>
      {"  "}
      <span>
        <FeatherIcon icon="circle" fill="#001737" color="#001737" size={20} />{" "}
        All
      </span>
      {"  "}
      <span>
        <FeatherIcon icon="circle" fill="#7a00ff" color="#7a00ff" size={20} />{" "}
        Subscriber
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
      <br />
      <br />
      {"  "}
      <span>
        Live Status :
        <FeatherIcon icon="globe" color="blue" size={15} /> Pending,
        <FeatherIcon icon="globe" color="#ff8d00" size={15} /> InProgress,
        <FeatherIcon icon="globe" color="dark" size={15} /> Completed,
        <FeatherIcon icon="globe" color="green" size={15} /> Live,
      </span>
    </div>
  );
}

export default ColorInfo;
