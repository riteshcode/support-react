import React from "react";
import { Anchor } from "component/UIElement/UIElement";
import WebsiteLink from "config/WebsiteLink";
import { useSelector } from "react-redux";
import { Trans } from "lang";

export default function CategoryProductMenu({ activeClass }) {
  const { language } = useSelector((state) => state.login);

  return (
    <ul className="nav nav-line nav-line-profile mg-b-30">
      <li className="nav-item">
        <Anchor
          path={WebsiteLink("/manage/category")}
          className={
            activeClass === "category"
              ? "nav-link d-flex align-items-center active"
              : "nav-link"
          }
        >
          {Trans("CATEGORY", language)}
        </Anchor>
      </li>
      <li className="nav-item">
        <Anchor
          path={WebsiteLink("/manage/product")}
          className={
            activeClass === "product"
              ? "nav-link d-flex align-items-center active"
              : "nav-link"
          }
        >
          {Trans("PRODUCT", language)}
        </Anchor>
      </li>
    </ul>
  );
}
