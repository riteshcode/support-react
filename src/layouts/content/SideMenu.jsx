import React, { useState } from "react";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { Anchor } from "component/UIElement/UIElement";
import { Trans } from "lang";
import WebsiteLink from "config/WebsiteLink";
import { useEffect } from "react";
import UrlActiveStatus from "component/UrlActiveStatus";
import { RoleName } from "config/StaticKey";

export default function SideMenu({ handleSubMenuList }) {
  const { language, module_list, permission, role } = useSelector(
    (state) => state.login
  );
  // console.log("role", role);
  const [activeClass, SetactiveClass] = useState("");

  const response =
    UrlActiveStatus(); /* get module_slug and parent_section path from current visit url */

  const menuList = JSON.parse(module_list);
  // console.log("response", response);

  const [showSubmenu, SetshowSubmenu] = useState("");

  const urlCurrent = window.location.pathname.split("/");
  let urlCurrentPath = "";

  // current page url for map to menu and submenu
  if (urlCurrent[1] === "superadmin") urlCurrentPath = urlCurrent[2];
  else urlCurrentPath = urlCurrent[1];

  const currenPath = urlCurrentPath;

  // console.log("currenPath", currenPath);

  const CheckMenuShow = (sectionId) => {
    if (role === RoleName) return true;
    else {
      const permissionList = JSON.parse(permission);
      if (permissionList[sectionId]) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    let abortController = new AbortController();
    SetshowSubmenu(response.moduleName);
    SetactiveClass(response.sectionUrl);
    // if (menuList !== undefined && menuList !== "" && menuList !== null) {
    //   for (let index = 0; index < menuList.length; index++) {
    //     const IsFound = menuList[index].menu.filter((menu) => {
    //       return menu.section_url === "/" + currenPath;
    //     });
    //     if (IsFound.length > 0) {
    //       SetshowSubmenu(menuList[index].module_slug);
    //       break;
    //     }
    //   }
    // }

    return () => abortController.abort();
  }, [currenPath]);

  return (
    <div id="sidebarMenu" className="sidebar sidebar-fixed bg-white">
      <div className="sidebar-header">
        <a href="!" id="mainMenuOpen">
          <i data-feather="menu"></i>
        </a>
        <h5>Components</h5>
        <a href="!" id="sidebarMenuClose">
          <i data-feather="x"></i>
        </a>
      </div>
      <div className="sidebar-body">
        <ul className="nav nav-aside">
          {menuList &&
            menuList.map((module, idxs) => {
              return (
                <li className="nav-label mg-t-10" key={idxs}>
                  <a
                    href="!"
                    onClick={(e) => {
                      e.preventDefault();
                      SetshowSubmenu(module.module_slug);
                    }}
                  >
                    {Trans(module.module_name, language)}
                    &nbsp;
                    <FeatherIcon
                      icon={`${
                        showSubmenu === module.module_slug
                          ? "chevron-up"
                          : "chevron-down"
                      }`}
                      fill="black"
                      size={5}
                    />
                  </a>

                  {showSubmenu === module.module_slug && (
                    <ul>
                      {module.menu &&
                        module.menu.map((menu, idx) => {
                          if (
                            activeClass === "" &&
                            activeClass === menu.section_slug
                          )
                            SetshowSubmenu(module.module_slug);

                          if (CheckMenuShow(menu.section_id) === true) {
                            return (
                              <React.Fragment key={idx}>
                                {menu.submenu.length > 0 ? (
                                  <li
                                    key={menu.section_id}
                                    className={`nav-item ${
                                      activeClass === menu.section_slug &&
                                      "active"
                                    }`}
                                  >
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSubMenuList(menu.submenu);
                                      }}
                                      className="nav-link"
                                    >
                                      {menu.section_icon && (
                                        <FeatherIcon
                                          icon={menu?.section_icon}
                                          fill="white"
                                        />
                                      )}

                                      <span>
                                        {Trans(menu.section_name, language)}
                                      </span>
                                    </a>
                                  </li>
                                ) : (
                                  <li
                                    key={menu.section_id}
                                    className={`nav-item ${
                                      activeClass === menu.section_slug &&
                                      "active"
                                    }`}
                                  >
                                    <Anchor
                                      path={WebsiteLink(menu.section_url)}
                                      className="nav-link"
                                    >
                                      {menu.section_icon && (
                                        <FeatherIcon
                                          icon={menu?.section_icon}
                                          fill="white"
                                        />
                                      )}

                                      <span>
                                        {Trans(menu.section_name, language)}
                                      </span>
                                    </Anchor>
                                  </li>
                                )}
                              </React.Fragment>
                            );
                          }
                        })}
                    </ul>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
