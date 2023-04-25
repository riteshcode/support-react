import React from "react";
import WebsiteLink from "config/WebsiteLink";
import { Col, Row, Anchor } from "component/UIElement/UIElement";
import {
  BannerListUrl,
  TemplateSettingUrl,
  TemplateUrl,
  TemplateSettingStoreUrl,
} from "config";
import POST from "axios/post";
import Notify from "component/Notify";
import { Trans } from "lang/index";
import { useSelector } from "react-redux";

function Section({ section, section_key, selectData, refreshItem }) {
  const { apiToken, language } = useSelector((state) => state.login);
  let active = "";
  const templateVal = selectData[`default_${section_key}`];
  if (section.section_option_key === templateVal) active = "active-theme";

  // handle choosen
  const changeTemplateTheme = (templateKey, templateValue) => {
    const filterData = {
      api_token: apiToken,
      template_key: templateKey,
      template_value: templateValue,
    };
    POST(TemplateSettingStoreUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        Notify(true, Trans(message, language));
        refreshItem();
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  return (
    <Col col={4} className={`theme-card ${active}`}>
      {active === "" && (
        <p className="text-center">
          <button
            type="button"
            className="btn btn-info"
            onClick={() => {
              changeTemplateTheme(
                `default_${section_key}`,
                section.section_option_key
              );
            }}
          >
            {Trans("CHOOSE_THEME", language)}
          </button>
        </p>
      )}
      <p className="text-center">
        <b>{section.section_option_name}</b>
      </p>
      <img
        src={section.image}
        alt=""
        className="theme-card-body-a-img"
        srcSet={section?.image}
      />
    </Col>
  );
}

export default Section;
