import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { TemplateDetailUrl, TemplateSettingUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { Col, Row, Anchor } from "component/UIElement/UIElement";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { useParams } from "react-router-dom";
import {
  PageDepartment,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import WebsiteLink from "config/WebsiteLink";
import SectionGroup from "./SectionGroup";

function ThemeDetail() {
  const { themeId } = useParams();

  const { apiToken, language } = useSelector((state) => state.login);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [listData, SetlistData] = useState([]);
  const [selectData, SetselectData] = useState([]);

  const findListBanner = (id) => {
    const filterData = {
      api_token: apiToken,
      template_id: id,
    };
    POST(TemplateDetailUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetlistData(data);
          loadTemplateSelectedData();
        } else Notify(true, Trans(message, language));
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  const loadTemplateSelectedData = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(TemplateSettingUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetselectData(data);
        } else Notify(true, Trans(message, language));
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    findListBanner(themeId);
    return () => abortController.abort();
  }, []);

  const refreshItem = () => {
    findListBanner(themeId);
  };

  return (
    <Content>
      <CheckPermission IsPageAccess="subscription.view">
        <>
          <PageHeader
            breadcumbs={[
              { title: Trans("DASHBOARD", language), link: "/", class: "" },
              {
                title: Trans("THEME", language),
                link: WebsiteLink("/themes"),
                class: "",
              },
              {
                title: listData?.template_name,
                link: "/",
                class: "active",
              },
            ]}
          />

          <div className="row row-xs">
            <div className="col-sm-12 col-lg-12">
              <CheckPermission IsPageAccess="role.view">
                <div className="card" id="custom-user-list">
                  {/* CARD HEADER */}

                  <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                    <h6 className="tx-uppercase tx-semibold mg-b-0">
                      {listData?.template_name}
                    </h6>
                  </div>

                  {/* END CARD HEADER */}
                  {contentloadingStatus ? (
                    <Loading />
                  ) : (
                    <div className="card-body">
                      <Row>
                        {listData?.template_sections &&
                          listData?.template_sections.map((section, idx) => (
                            <SectionGroup
                              sectiongroup={section}
                              key={idx}
                              selectData={selectData}
                              refreshItem={refreshItem}
                            />
                          ))}
                      </Row>
                    </div>
                  )}
                </div>
              </CheckPermission>
            </div>
          </div>
        </>
      </CheckPermission>
    </Content>
  );
}

export default ThemeDetail;
