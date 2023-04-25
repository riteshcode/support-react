import React from "react";
import FeatherIcon from "feather-icons-react";
import { Anchor } from "./UIElement/UIElement";
import { Button } from "react-bootstrap";
import CheckPermission from "helper";
import WebsiteLink from "config/WebsiteLink";

function PageHeader(props) {
  const { EPG, breadcumbs, addButton, addButtonFun, addMulitpleButton } = props;
  const breadlist = [];
  if (breadcumbs.length > 0) {
    for (let index = 0; index < breadcumbs.length; index++) {
      if (breadcumbs[index].class === "active") {
        breadlist.push(
          <li
            key={`key${index}`}
            className="breadcrumb-item active"
            aria-current="page"
          >
            {breadcumbs[index].title}
          </li>
        );
      } else {
        breadlist.push(
          <li key={`key${index}`} className="breadcrumb-item">
            <Anchor path={WebsiteLink(breadcumbs[index].link)}>
              {breadcumbs[index].title}
            </Anchor>
          </li>
        );
      }
    }
  }
  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mg-b-20 mg-lg-b-25 mg-xl-b-30">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-style1 mg-b-10">
              {breadlist}
            </ol>
          </nav>
          {/* <h4 className="mg-b-0 tx-spacing--1 text-capitalize">{heading}</h4> */}
        </div>
        {EPG && (
          <div className="d-none d-md-block">
            <button className="btn btn-sm pd-x-15 btn-white btn-uppercase">
              <FeatherIcon icon="mail" fill="white" className="wd-10 mg-r-5" />{" "}
              Email
            </button>
            <button className="btn btn-sm pd-x-15 btn-white btn-uppercase mg-l-5">
              <FeatherIcon
                icon="printer"
                // fill="white"
                className="wd-10 mg-r-5"
              />{" "}
              Print
            </button>
            <button className="btn btn-sm pd-x-15 btn-primary btn-uppercase mg-l-5">
              <FeatherIcon icon="file" fill="white" className="wd-10 mg-r-5" />{" "}
              Generate Report
            </button>
          </div>
        )}
        {addButton && (
          <>
            {addButton.type === "function" ? (
              <>
                {addButton.permission ? (
                  <CheckPermission
                    IsPageAccess={`${addButton.permission}-manage`}
                  >
                    <Button variant="primary" onClick={addButtonFun}>
                      <FeatherIcon
                        icon="file"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {addButton.label}
                    </Button>
                  </CheckPermission>
                ) : (
                  <Button variant="primary" onClick={addButtonFun}>
                    <FeatherIcon
                      icon="plus"
                      // fill="white"
                      className="wd-10 mg-r-5"
                    />
                    {addButton.label}
                  </Button>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )}

        {addMulitpleButton && (
          <>
            <div className="d-none d-md-block">
              {addMulitpleButton.map((info, idx) => {
                return (
                  <React.Fragment key={idx}>
                    {info.type === "function" ? (
                      <CheckPermission
                        IsPageAccess={`${info.permission}-manage`}
                        key={idx}
                      >
                        <Button variant="primary" onClick={info.fun_name}>
                          {info.label}
                        </Button>
                      </CheckPermission>
                    ) : (
                      <div key={idx}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PageHeader;
