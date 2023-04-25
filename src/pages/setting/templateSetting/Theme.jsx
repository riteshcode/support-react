import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  BannerListUrl,
  TemplateSettingUrl,
  TemplateUrl,
  TemplateSettingStoreUrl,
} from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Col, Row, Anchor } from "component/UIElement/UIElement";
import { useForm } from "react-hook-form";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import {
  PageDepartment,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import WebsiteLink from "config/WebsiteLink";
import ModalImage from "react-modal-image-responsive";

function Theme() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const [selectData, SetselectData] = useState([]);

  const methods = useForm();
  const {
    register,
    control,
    formState: { errors },
    getValue,
    handleSubmit,
  } = methods;

  const [templateList, SettemplateList] = useState([]);

  const loadTemplateData = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(TemplateUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SettemplateList(data);
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
    loadTemplateData();
    return () => abortController.abort();
  }, []);

  const selectedHtml = (key, value) => {
    console.log("selectData", selectData);
    for (const selectKey in selectData) {
      if (selectKey === key) {
        if (selectData[key] === value) return true;
      }
    }

    return false;
  };

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
        loadTemplateData();
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  return (
    <Content>
      <CheckPermission IsPageAccess="subscription.view">
        <React.Fragment>
          <PageHeader
            breadcumbs={[
              { title: Trans("DASHBOARD", language), link: "/", class: "" },
              { title: Trans("SETTING", language), link: "/", class: "" },
              {
                title: Trans("TEMPLATE", "language"),
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
                      {Trans("TEMPLATE_LIST", language)}
                    </h6>
                  </div>

                  {/* END CARD HEADER */}
                  {contentloadingStatus ? (
                    <Loading />
                  ) : (
                    <div className="card-body">
                      <Row>
                        {templateList &&
                          templateList.map((template, idx) => {
                            let active = "";
                            const templateVal = selectData?.default_theme;
                            if (template.template_key === templateVal)
                              active = "active-theme";
                            return (
                              <Col col={4} key={idx}>
                                <div className={`card theme-card ${active}`}>
                                  <div
                                    className="card-body"
                                    style={{ minHeight: "386px" }}
                                  >
                                    <p className="text-center">
                                      <b>{template.template_name}</b>
                                    </p>
                                    <div className="">
                                      <ModalImage
                                        small={template.image}
                                        large={template.image}
                                        alt={template.image}
                                        className="modalImage"
                                      />
                                    </div>
                                    <br />
                                    <div className="text-center">
                                      <Anchor
                                        path={WebsiteLink(
                                          `/themes/design/${template.template_id}`
                                        )}
                                        className="btn btn-dark custom-btn"
                                      >
                                        <b>
                                          {Trans("CUSTOMIZE_DESIGN", language)}
                                        </b>
                                      </Anchor>
                                      <Anchor
                                        path={WebsiteLink(
                                          `/themes/component/${template.template_id}`
                                        )}
                                        className="btn btn-info custom-btn"
                                      >
                                        <b>
                                          {Trans("MANAGE_SECTION", language)}
                                        </b>
                                      </Anchor>
                                      {active === "" && (
                                        <button
                                          type="button"
                                          className="btn btn-primary custom-btn"
                                          onClick={() => {
                                            changeTemplateTheme(
                                              "default_theme",
                                              template?.template_key
                                            );
                                          }}
                                        >
                                          {Trans("ACTIVE_THEME", language)}
                                        </button>
                                      )}
                                    </div>

                                    <div className="text-center pd-10"></div>
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                      </Row>
                    </div>
                  )}
                </div>
              </CheckPermission>
            </div>
          </div>
        </React.Fragment>
      </CheckPermission>
    </Content>
  );
}

export default Theme;
