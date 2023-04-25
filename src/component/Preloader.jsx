import React from "react";
function Preloader() {
  return (
    <>
      <div className="container">
        <div className="row" style={{ margin: "10%" }}>
          <div className="col-md-12 text-center">
            <div className="text-center">
              <div
                className="spinner-border"
                style={{ height: "3rem", width: "3rem" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Preloader;
