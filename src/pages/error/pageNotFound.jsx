import React from "react";
import Content from "../../layouts/content";

function PageNotFound() {
  return (
    <Content>
      <div className="text-center">
        <img src="/page-not-found.png" className="not-found-img" alt="" />
      </div>

      {/* <div className="content content-fixed content-auth-alt">
        <div className="container ht-100p tx-center">
          <div className="ht-100p d-flex flex-column align-items-center justify-content-center">
            <div className="">
              
            </div>
          </div>
        </div>
      </div> */}
    </Content>
  );
}

export default PageNotFound;
