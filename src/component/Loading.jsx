import React from "react";

function Loading() {
  return (
    <div className="row">
      <div className="col-md-12 text-center" style={{ padding: "26%" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
