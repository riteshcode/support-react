import React from "react";
import { useSelector } from "react-redux";
import { Anchor } from "component/UIElement/UIElement";
import { Trans } from "lang";
import WebsiteLink from "config/WebsiteLink";
function SideBar({ activeClass }) {
  const { language } = useSelector((state) => state.login);
  return (
    <>
      <label className="tx-sans tx-10 tx-medium tx-spacing-1 tx-uppercase tx-color-03 mg-b-15">
        {Trans("SETTINGS", language)}
      </label>
      <nav className="nav nav-classNameic">
        <Anchor
          path={WebsiteLink("/setting/business")}
          className={
            activeClass === "business" ? "nav-link active" : "nav-link"
          }
        >
          {Trans("BUSINESS_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/application")}
          className={
            activeClass === "application" ? "nav-link active" : "nav-link"
          }
        >
          {Trans("APPLICATION_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/email")}
          className={activeClass === "email" ? "nav-link active" : "nav-link"}
        >
          {Trans("EMAIL_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/sms")}
          className={activeClass === "sms" ? "nav-link active" : "nav-link"}
        >
          {Trans("SMS_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/tax")}
          className={activeClass === "tax" ? "nav-link active" : "nav-link"}
        >
          {Trans("TAX_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/payment")}
          className={
            activeClass === "department" ? "nav-link active" : "nav-link"
          }
        >
          {Trans("PAY_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/website")}
          className={
            activeClass === "department" ? "nav-link active" : "nav-link"
          }
        >
          {Trans("WEB_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/notification")}
          className={
            activeClass === "department" ? "nav-link active" : "nav-link"
          }
        >
          {Trans("NOTI_SETTING", language)}
        </Anchor>
      </nav>
    </>
  );
}

export default SideBar;
