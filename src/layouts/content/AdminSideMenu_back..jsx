import React, { useState } from "react";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { Anchor } from "component/UIElement/UIElement";
import { Trans } from "lang";
// import { useState } from "react";

export default function AdminSideMenu() {
  const { language } = useSelector((state) => state.login);
  const [showSubmenu, SetshowSubmenu] = useState("");

  const urlLink = (link) => {
    const lin = window.location.pathname.split("/")[1];
    if (lin === "superadmin") return "/superadmin" + link;
    else return link;
  };

  const urlCurrent = window.location.pathname.split("/");
  let urlCurrentPath = "";
  if (urlCurrent[1] === "superadmin") {
    urlCurrentPath = urlCurrent[2];
  } else {
    urlCurrentPath = urlCurrent[1];
  }
  const currenPath = urlCurrentPath;

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
          <li className="nav-label mg-t-10">
            <a
              href="!"
              onClick={(e) => {
                e.preventDefault();
                if (showSubmenu === "")
                  SetshowSubmenu("APPLICATION_MANAGEMENT");
                else SetshowSubmenu("");
              }}
            >
              {Trans("APPLICATION_MANAGEMENT", language)}
              &nbsp;
              {showSubmenu === "APPLICATION_MANAGEMENT" ? (
                <FeatherIcon icon="chevron-up" fill="black" size={5} />
              ) : (
                <FeatherIcon icon="chevron-down" fill="black" size={5} />
              )}
            </a>

            {showSubmenu === "APPLICATION_MANAGEMENT" && (
              <ul>
                <li
                  className={
                    currenPath && currenPath === "setting"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Anchor
                    path={urlLink("/setting/application/application")}
                    className="nav-link"
                  >
                    <FeatherIcon icon="settings" fill="white" />
                    <span>{Trans("SETTINGS", language)}</span>
                  </Anchor>
                </li>

                <li
                  className={
                    currenPath && currenPath === "country"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Anchor path={urlLink("/country")} className="nav-link">
                    <FeatherIcon icon="flag" fill="white" />
                    <span>{Trans("COUNTRY", language)}</span>
                  </Anchor>
                </li>
                <li
                  className={
                    currenPath && currenPath === "currency"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Anchor path={urlLink("/currency")} className="nav-link">
                    <FeatherIcon icon="dollar-sign" fill="white" />
                    <span>{Trans("CURRENCY", language)}</span>
                  </Anchor>
                </li>
                <li
                  className={
                    currenPath && currenPath === "language"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Anchor path={urlLink("/language")} className="nav-link">
                    <FeatherIcon icon="globe" fill="white" />
                    <span>{Trans("LANGUAGE", language)}</span>
                  </Anchor>
                </li>
                <li
                  className={
                    currenPath && currenPath === "translation"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Anchor path={urlLink("/translation")} className="nav-link">
                    <FeatherIcon icon="list" fill="white" />
                    <span>{Trans("TRANSLATION", language)}</span>
                  </Anchor>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-label mg-t-10">
            <a
              href="!"
              onClick={(e) => {
                e.preventDefault();
                if (showSubmenu === "") SetshowSubmenu("WEBSITE_MANAGEMENT");
                else SetshowSubmenu("");
              }}
            >
              {Trans("WEBSITE_MANAGEMENT", language)}
              &nbsp;
              {showSubmenu === "WEBSITE_MANAGEMENT" ? (
                <FeatherIcon icon="chevron-up" fill="black" size={5} />
              ) : (
                <FeatherIcon icon="chevron-down" fill="black" size={5} />
              )}
            </a>

            {showSubmenu === "WEBSITE_MANAGEMENT" && (
              <ul>
                <li
                  className={
                    currenPath && currenPath === "setting"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Anchor
                    path={urlLink("/setting/website/website")}
                    className="nav-link"
                  >
                    <FeatherIcon icon="settings" fill="white" />
                    <span>{Trans("SETTINGS", language)}</span>
                  </Anchor>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-label mg-t-10">
            <a
              href="!"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                if (showSubmenu === "") SetshowSubmenu("USER_MANAGEMENT");
                else SetshowSubmenu("");
              }}
            >
              {Trans("USER_MANAGEMENT", language)}
              {showSubmenu === "USER_MANAGEMENT" ? (
                <FeatherIcon icon="chevron-up" fill="black" size={10} />
              ) : (
                <FeatherIcon icon="chevron-down" fill="black" size={10} />
              )}
            </a>
            {showSubmenu === "USER_MANAGEMENT" && (
              <ul>
                <li
                  className={
                    currenPath && currenPath === "user"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Anchor path={urlLink("/user")}>
                    <FeatherIcon icon="user" fill="white" />
                    {Trans("USERS", language)}
                  </Anchor>
                </li>
                <li
                  className={
                    currenPath && currenPath === "role"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <FeatherIcon icon="briefcase" fill="white" />
                  <Anchor path={urlLink("/role")}>
                    {Trans("ROLES", language)}
                  </Anchor>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-label mg-t-10">{Trans("SECTIONS", language)}</li>
          <li
            className={
              (currenPath && currenPath === "department") ||
              currenPath === "leave" ||
              currenPath === "attendance"
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Anchor path={urlLink("/department")} className="nav-link">
              <FeatherIcon icon="calendar" fill="white" />
              <span>{Trans("HRM", language)}</span>
            </Anchor>
          </li>
          <li
            className={
              currenPath && currenPath === "manage"
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Anchor path={urlLink("/manage/category")} className="nav-link">
              <FeatherIcon icon="shopping-bag" fill="white" />
              <span>{Trans("CATEGORY_PRODUCT", language)}</span>
            </Anchor>
          </li>
        </ul>
      </div>
    </div>
  );
}
