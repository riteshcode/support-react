import React from "react";
function Alert(props) {
  const { type, children } = props;
  return (
    <>
      <div className={`alert alert-${type} alert-dismissible" role="alert`}>
        {children}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </>
  );
}

export default Alert;
