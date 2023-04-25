import React, { useState } from "react";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { Anchor } from "component/UIElement/UIElement";
import { Trans } from "lang";
import WebsiteLink from "config/WebsiteLink";
import { useEffect } from "react";

export default function SideMenu({ handleSubMenuList }) {
  const { language, module_list, permission, role } = useSelector(
    (state) => state.login
  );

  const menuList = JSON.parse(module_list);

  const [showSubmenu, SetshowSubmenu] = useState("");

  const urlCurrent = window.location.pathname.split("/");
  let urlCurrentPath = "";
  if (urlCurrent[1] === "superadmin") {
    urlCurrentPath = urlCurrent[2];
  } else {
    urlCurrentPath = urlCurrent[1];
  }
  const currenPath = urlCurrentPath;

  const CheckMenuShow = (sectionId) => {
    if (role === "Super Admin" || role === "Admin") return true;
    else {
      const permissionList = JSON.parse(permission);
      if (permissionList[sectionId]) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (menuList !== undefined && menuList !== "" && menuList !== null) {
      for (let index = 0; index < menuList.length; index++) {
        const IsFound = menuList[index].menu.filter((menu) => {
          return menu.section_url === "/" + currenPath;
        });
        if (IsFound.length > 0) {
          SetshowSubmenu(menuList[index].module_slug);
          break;
        }
      }
    }
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
            menuList.map((module) => {
              return (
                <li className="nav-label mg-t-10" key={module.module_id}>
                  <a
                    href="!"
                    onClick={(e) => {
                      e.preventDefault();
                      SetshowSubmenu(module.module_slug);
                    }}
                  >
                    {Trans(module.module_name, language)}
                    &nbsp;
                    {showSubmenu === module.module_slug ? (
                      <FeatherIcon icon="chevron-up" fill="black" size={5} />
                    ) : (
                      <FeatherIcon icon="chevron-down" fill="black" size={5} />
                    )}
                  </a>

                  {showSubmenu === module.module_slug && (
                    <ul>
                      {module.menu &&
                        module.menu.map((menu, idx) => {
                          if (
                            currenPath === "" &&
                            "/" + currenPath === menu.section_url
                          )
                            SetshowSubmenu(module.module_slug);

                          if (CheckMenuShow(menu.section_id) === true) {
                            return (
                              <React.Fragment key={idx}>
                                {menu.submenu.length > 0 ? (
                                  <li
                                    key={menu.section_id}
                                    className={
                                      currenPath &&
                                      "/" + currenPath === menu.section_url
                                        ? "nav-item active"
                                        : "nav-item"
                                    }
                                  >
                                    <a
                                      href="!"
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
                                    className={
                                      currenPath &&
                                      "/" + currenPath === menu.section_url
                                        ? "nav-item active"
                                        : "nav-item"
                                    }
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
