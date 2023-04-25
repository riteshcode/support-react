import React from "react";
import Dashboard from "./Dashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";
import { useSelector } from "react-redux";

function Index() {
  const { userType } = useSelector((state) => state.login);

  return (
    <React.Fragment>
      {userType === "subscriber" ? <Dashboard /> : <SuperAdminDashboard />}
    </React.Fragment>
  );
}

export default Index;
