import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import SideMenu from "./SideMenu";
import SideSubMenu from "./SideSubMenu";
import HrmMenu from "pages/HrmMenu";

function Index(props) {
  const [subMenuList, SetSubMenuList] = useState([]);

  const handleSubMenuList = (submenulist) => {
    SetSubMenuList(submenulist);
  };

  return (
    <>
      <SideMenu handleSubMenuList={handleSubMenuList} />
      <div className="content content-fixed">
        <div className="row row-xs">
          <div className="col-sm-12 col-lg-12">
            {subMenuList.length > 0 && (
              <HrmMenu
                subMenuList={subMenuList === undefined ? [] : subMenuList}
                activeClass=""
              />
            )}
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
