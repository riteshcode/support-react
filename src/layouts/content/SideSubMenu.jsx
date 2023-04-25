import React from "react";
import { useSelector } from "react-redux";
import { Anchor } from "component/UIElement/UIElement";
import { Trans } from "lang";
import WebsiteLink from "config/WebsiteLink";

function SideSubMenu({ activeClass, SubMenuList }) {
  const { language } = useSelector((state) => state.login);

  return (
    <>
      <label className="tx-sans tx-10 tx-medium tx-spacing-1 tx-uppercase tx-color-03 mg-b-15">
        {Trans("SETTINGS", language)}
      </label>
      <nav className="nav nav-classNameic">
        {SubMenuList.length > 0 &&
          SubMenuList.map((submenu) => {
            return (
              <Anchor
                key={submenu.section_id}
                path={WebsiteLink(submenu.section_url)}
                className={
                  activeClass === "application" ? "nav-link active" : "nav-link"
                }
              >
                {Trans(submenu.section_name, language)}
              </Anchor>
            );
          })}
      </nav>
    </>
  );
}
export default SideSubMenu;
