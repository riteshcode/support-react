import React from "react";
import { Anchor } from "component/UIElement/UIElement";
import { useSelector } from "react-redux";
import WebsiteLink from "config/WebsiteLink";
import { Trans } from "lang";

function Menu() {
  const { isAuthenticated, language, quickSectionList } = useSelector(
    (state) => state.login
  );

  return (
    <>
      {isAuthenticated && (
        <ul className="nav navbar-menu">
          <li className="nav-item">
            <Anchor path={WebsiteLink("/")} className="nav-link">
              {Trans("DASHBOARD", language)}
            </Anchor>
          </li>
          {quickSectionList &&
            JSON.parse(quickSectionList).map((menu, index) => {
              let activeMenu = "";
              const cls = `nav-item ${activeMenu}`;
              return (
                <li className={cls} key={index}>
                  <Anchor
                    path={WebsiteLink(menu.section_url)}
                    className="nav-link"
                  >
                    {menu.section_name}
                  </Anchor>
                </li>
              );
            })}
        </ul>
      )}
    </>
  );
}

export default Menu;
