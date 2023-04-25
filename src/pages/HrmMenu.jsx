import React, { useEffect, useState } from "react";
import { Anchor } from "component/UIElement/UIElement";
import WebsiteLink from "config/WebsiteLink";
import { useSelector } from "react-redux";
import { Trans } from "lang";

export default function HrmMenu() {
  const { language, tempSubMenuHold } = useSelector((state) => state.login);
  const [subMenuList, SetSubMenuList] = useState([]);
  const [activeClass, SetactiveClass] = useState("");

  const checkSubMenuShow = () => {
    const urlCurrent = window.location.pathname.split("/");
    let urlCurrentPath = "";

    /* check url curr position  */
    if (urlCurrent[1] === "superadmin") {
      urlCurrentPath = urlCurrent[2];
      delete urlCurrent[1];
    } else urlCurrentPath = urlCurrent[1];

    const currenPath = urlCurrent.join("/");

    SetactiveClass(currenPath); // set currenPath to active class

    if (tempSubMenuHold !== null) {
      const SubMenuList = JSON.parse(tempSubMenuHold);

      /* finding current url exist in temp submenu */
      let foundSub = SubMenuList.filter((sub, index) => {
        return sub.section_url === currenPath;
      });

      // if dounf than show sub menu on page
      if (foundSub.length > 0) SetSubMenuList(SubMenuList);
    }
    return true;
  };

  useEffect(() => {
    let abortController = new AbortController();
    checkSubMenuShow();
    return () => abortController.abort();
  }, [tempSubMenuHold]);

  return (
    <React.Fragment>
      {subMenuList && subMenuList.length > 0 && (
        <ul className="nav nav-line nav-line-profile mg-b-30">
          {subMenuList.map((submenu, idx) => {
            const activeItem =
              activeClass === submenu.section_url ? "active" : "";
            return (
              <li className="nav-item" key={idx}>
                <Anchor
                  key={submenu.section_id}
                  path={WebsiteLink(submenu.section_url)}
                  className={`nav-link d-flex align-items-center ${activeItem}`}
                >
                  {Trans(submenu.section_name, language)}
                </Anchor>
              </li>
            );
          })}
        </ul>
      )}
    </React.Fragment>
  );
}
