import React from "react";
import { useSelector } from "react-redux";
import { Anchor } from "component/UIElement/UIElement";
import { Trans } from "lang";
import WebsiteLink from "config/WebsiteLink";

function SideBarApp({ activeClass }) {
  const { language } = useSelector((state) => state.login);
  return (
    <>
      <label className="tx-sans tx-10 tx-medium tx-spacing-1 tx-uppercase tx-color-03 mg-b-15">
        {Trans("WEBSITE_MANAGEMENT", language)}
      </label>
      <nav className="nav nav-classNameic">
        <Anchor
          path={WebsiteLink("/setting/website/website")}
          className={activeClass === "website" ? "nav-link active" : "nav-link"}
        >
          {Trans("WEBSITE_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/website/invoice")}
          className={activeClass === "invoice" ? "nav-link active" : "nav-link"}
        >
          {Trans("INVOICE_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/website/payment")}
          className={activeClass === "payment" ? "nav-link active" : "nav-link"}
        >
          {Trans("PAYMENT_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/website/profit")}
          className={activeClass === "profit" ? "nav-link active" : "nav-link"}
        >
          {Trans("PROFIT_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/website/tax")}
          className={activeClass === "tax" ? "nav-link active" : "nav-link"}
        >
          {Trans("TAX_SETTING", language)}
        </Anchor>
        <Anchor
          path={WebsiteLink("/setting/website/shipping")}
          className={
            activeClass === "shipping" ? "nav-link active" : "nav-link"
          }
        >
          {Trans("SHIPPING_SETTING", language)}
        </Anchor>
      </nav>
    </>
  );
}

export default SideBarApp;
