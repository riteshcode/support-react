import React from "react";
import FeatherIcon from "feather-icons-react";

function CC() {
  return (
    <div
      id="accordion4"
      className="accordion accordion-style2 ui-accordion ui-widget ui-helper-reset "
    >
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <h6 className="accordion-title ui-accordion-header ui-corner-top ui-state-default ui-accordion-header-active ui-state-active ui-accordion-icons h6Module">
          <span>{"module_name"}</span>{" "}
          <span style={{ float: "right" }}>
            <span title="Edit">
              <FeatherIcon icon="x-square" color="red" size={20} />
            </span>
          </span>
        </h6>
        <div className="accordion-body ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content h6bodyIn">
          <div className="row">
            <div className="col-md-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CC;
