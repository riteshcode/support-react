import React from "react";
import { Anchor } from "component/UIElement/UIElement";
import Menu from "./component/menu";
import Notification from "layouts/superadminHeader/component/notification";
import Messages from "layouts/superadminHeader/component/messages";
import Profile from "layouts/superadminHeader/component/profile";
import { useSelector } from "react-redux";
import WebsiteLogo from "assets/img/SupportNannyLogo.png";
import { ApplicationLogo } from "config/StaticKey";
import { GetKeyValue } from "global/GetKeyValue";

function Index() {
  const { isAuthenticated, superSettingInfo } = useSelector(
    (state) => state.login
  );
  // const setList

  return (
    <React.Fragment>
      <header className="navbar navbar-header navbar-header-fixed">
        <a href="/" id="mainMenuOpen" className="burger-menu">
          <i data-feather="menu"></i>
        </a>
        <div className="navbar-brand">
          <Anchor path="/" className="df-logo">
            <img
              src={
                GetKeyValue(ApplicationLogo, superSettingInfo)
                  ? GetKeyValue(ApplicationLogo, superSettingInfo)
                  : WebsiteLogo
              }
              height="50"
            />
          </Anchor>
        </div>
        <div id="navbarMenu" className="navbar-menu-wrapper">
          <div className="navbar-menu-header">
            <a href="/" id="mainMenuClose">
              <i data-feather="x"></i>
            </a>
          </div>
          <Menu />
        </div>
        <div className="navbar-right">
          {isAuthenticated && (
            <>
              <Messages />
              <Notification />
              <Profile />
            </>
          )}
        </div>
      </header>
    </React.Fragment>
  );
}

export default Index;
