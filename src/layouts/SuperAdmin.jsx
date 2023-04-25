import React from "react";
import SuperadminHeader from "layouts/superadminHeader/index";
import Footer from "./footer";

function SuperAdmin(props) {
  return (
    <React.Fragment>
      <SuperadminHeader />
      {props.children}
      <Footer />
    </React.Fragment>
  );
}

export default SuperAdmin;
