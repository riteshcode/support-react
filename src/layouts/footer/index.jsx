import React from "react";
import Moment from "react-moment";
import { useSelector, useDispatch } from "react-redux";
import { ApplicationTitle } from "config/StaticKey";
import { GetKeyValue } from "global/GetKeyValue";

function Index() {
  const date = new Date();
  const { isAuthenticated, superSettingInfo } = useSelector(
    (state) => state.login
  );

  return (
    <footer className={isAuthenticated ? "footer" : "footer ml-0"}>
      <div>
        <span>
          @ <Moment format="YYYY">{date}</Moment>{" "}
          {GetKeyValue(ApplicationTitle, superSettingInfo)
            ? GetKeyValue(ApplicationTitle, superSettingInfo)
            : "SupportNanny"}
        </span>
      </div>
    </footer>
  );
}

export default Index;
