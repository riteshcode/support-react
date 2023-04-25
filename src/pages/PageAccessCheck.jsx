import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PageAccessCheck(props) {
  const { component } = props;
  const { isAuthenticated, userType } = useSelector((state) => state.login);
  let page = "";
  // auth condition wise
  if (isAuthenticated) {
    const urlParam = window.location.pathname.split("/")[1];
    // userType wise page/component render
    if (userType === "administrator") {
      if (urlParam === "superadmin") page = component;
      else page = <Navigate to="/superadmin/" />;
    } else {
      if (urlParam !== "superadmin") page = component;
      else page = <Navigate to="/" />;
    }
  } else {
    const urlParam = window.location.pathname.split("/")[1];
    if (urlParam === "superadmin") page = <Navigate to="/superadmin/login" />;
    else page = <Navigate to="/login" />;
  }

  return <React.Fragment>{page}</React.Fragment>;
}

export default PageAccessCheck;
