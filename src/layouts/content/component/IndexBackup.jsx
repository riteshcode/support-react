import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import SideMenu from "./SideMenu";
import SideSubMenu from "./SideSubMenu";

function Index(props) {
  // const { userType } = useSelector((state) => state.login);
  const [subMenuList, SetSubMenuList] = useState([]);

  const handleSubMenuList = (submenulist) => {
    SetSubMenuList(submenulist);
  };

  return (
    <>
      <SideMenu handleSubMenuList={handleSubMenuList} />
      <div className="content content-fixed">
        <div className="row row-xs">
          {subMenuList.length > 0 ? (
            <>
              <div className="col-lg-3 col-xl-2 d-none d-lg-block">
                {/* <SideSubMenu activeClass={"user"} SubMenuList={subMenuList} /> */}
              </div>
              <div className="col-sm-12 col-lg-12">{props.children}</div>
            </>
          ) : (
            <div className="col-sm-12 col-lg-12">{props.children}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
