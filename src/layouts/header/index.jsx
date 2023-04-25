import React from "react";
import { Anchor } from "../../component/UIElement/UIElement";
import Menu from "./component/menu";
import Notification from "./component/notification";
import Messages from "./component/messages";
import Profile from "./component/profile";
import { useSelector } from "react-redux";

function Index() {
  const { isAuthenticated } = useSelector((state) => state.login);
  return (
    <>
      <header className="navbar navbar-header navbar-header-fixed">
        <a href="/" id="mainMenuOpen" className="burger-menu">
          <i data-feather="menu"></i>
        </a>
        <div className="navbar-brand">
          <Anchor path="/" className="df-logo">
            dash<span>forge</span>
          </Anchor>
        </div>
        <div id="navbarMenu" className="navbar-menu-wrapper">
          <div className="navbar-menu-header">
            <Anchor path="/" className="df-logo">
              dash<span>forge</span>
            </Anchor>
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
    </>
  );
}

export default Index;
