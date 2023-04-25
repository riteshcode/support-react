import React from "react";
import { useState } from "react";
import SideMenu from "./SideMenu";
import HrmMenu from "pages/HrmMenu";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { tempSubMenu } from "redux/slice/loginSlice";
import WebsiteLink from "config/WebsiteLink";

function Index(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubMenuList = (submenulist) => {
    console.log("submenulist", submenulist);
    if (submenulist.length > 0) {
      /* set to temp Menu  */
      dispatch(tempSubMenu(submenulist));

      /* navigate to first menu */
      console.log(
        "Navigate section_slug",
        WebsiteLink(submenulist[0]["section_url"])
      );
      navigate(WebsiteLink(submenulist[0]["section_url"]));
    }
  };

  return (
    <React.Fragment>
      <SideMenu handleSubMenuList={handleSubMenuList} />
      <div className="content content-fixed">
        <div className="row row-xs">
          <div className="col-sm-12 col-lg-12">
            <HrmMenu />
            {props.children}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Index;
