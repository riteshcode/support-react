import React from "react";

export default function StatusTab({ leaveInfo }) {
  return (
    <>
      <div className="row row-xs">
        {leaveInfo &&
          leaveInfo.map((leave, idx) => {
            return (
              <div className="col-sm-6 col-lg-3" key={idx}>
                <div className="card card-body">
                  <h6 className="tx-uppercase tx-11 tx-spacing-1 tx-color-02 tx-semibold mg-b-8">
                    {leave?.status_name}
                  </h6>
                  <div className="d-flex d-lg-block d-xl-flex align-items-end">
                    <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">
                      {leave?.total}
                    </h3>
                  </div>
                  <div className="chart-three">
                    <span>Total</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
