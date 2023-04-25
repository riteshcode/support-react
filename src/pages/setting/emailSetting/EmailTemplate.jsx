import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  EmailTemplateListUrl,
  MenuGroupUrl,
  EmailTemplateChangeStatusUrl,
  EmailTemplateDestroyUrl,
} from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Create from "./Create";
import { Col, BadgeShow } from "component/UIElement/UIElement";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { useParams } from "react-router-dom";
import { EmailSetting } from "config/WebsiteUrl";

import {
  PageDepartment,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import Edit from "./Edit";
import WebsiteLink from "config/WebsiteLink";

function EmailTemplate() {
  const { menuGroupId } = useParams();

  const { apiToken, language, userType } = useSelector((state) => state.login);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const loadSettingData = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(MenuGroupUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetSectionListing(data.data_list);
        } else Notify(true, Trans(message, language));
      })

      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    loadSettingData();
    findListBanner(menuGroupId);
    return () => abortController.abort();
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  // handle change group name
  const [sectionListing, SetSectionListing] = useState([]);

  const [bannerList, SetBannerList] = useState([]);

  const findListBanner = (id) => {
    const filterData = {
      api_token: apiToken,
      group_id: id,
    };
    POST(EmailTemplateListUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        console.log("Banner list", data);
        if (status) {
          SetloadingStatus(false);
          SetBannerList(data.data_list);
        } else Notify(true, Trans(message, language));
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  const destroyItem = (id) => {
    const filterData = {
      api_token: apiToken,
      template_id: id,
    };
    POST(EmailTemplateDestroyUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        Notify(true, Trans(message, language));
        findListBanner(menuGroupId);
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  const changeStatus = (id) => {
    const filterData = {
      api_token: apiToken,
      template_id: id,
    };
    POST(EmailTemplateChangeStatusUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        Notify(true, Trans(message, language));
        findListBanner(menuGroupId);
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);
  const [editData, SetEditData] = useState();

  const editFunction = (updateId) => {
    SetEditData(updateId);
    setEditModalShow(true);
  };

  const filterItem = () => {
    findListBanner(menuGroupId);
  };

  return (
    <Content>
      <CheckPermission IsPageAccess="subscription.view">
        <React.Fragment>
          <PageHeader
            breadcumbs={[
              { title: Trans("DASHBOARD", language), link: "/", class: "" },
              {
                title: Trans("EMAIL_GROUP", language),
                link: WebsiteLink(EmailSetting),
                class: "",
              },
              {
                title: Trans("EMAIL_TEMPLATE", "language"),
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
                      {Trans("EMAIL_TEMPLATE_LIST", language)}
                    </h6>
                    <div className="d-none d-md-flex">
                      <Button
                        variant="primary"
                        className="btn btn-info"
                        onClick={handleModalShow}
                      >
                        {Trans("ADD_EMAIL_TEMPLATE", language)}
                      </Button>{" "}
                    </div>
                  </div>

                  {/* END CARD HEADER */}
                  {contentloadingStatus ? (
                    <Loading />
                  ) : (
                    <div className="card-body">
                      <Col col={12}>
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>{Trans("SL_NO", language)}</th>
                                <th>{Trans("template_subject", language)}</th>
                                <th>{Trans("STATUS", language)}</th>
                                <th className="text-center">
                                  {Trans("ACTION", language)}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {bannerList &&
                                bannerList.map((banner, idx) => {
                                  return (
                                    <tr key={idx}>
                                      <td>{idx + 1}</td>
                                      <td>{banner.template_subject}</td>

                                      <td>
                                        <BadgeShow
                                          type={
                                            banner.status
                                              ? "active"
                                              : "deactive"
                                          }
                                          content={
                                            banner.status
                                              ? "active"
                                              : "deactive"
                                          }
                                        />{" "}
                                      </td>
                                      <td className="text-center">
                                        <button className="btn btn-info">
                                          <FeatherIcon
                                            icon="edit-2"
                                            fill="white"
                                            size={18}
                                            onClick={() =>
                                              editFunction(banner?.template_id)
                                            }
                                          />
                                        </button>
                                        {"  "}
                                        <button className="btn btn-warning">
                                          <FeatherIcon
                                            icon="repeat"
                                            color="white"
                                            onClick={() =>
                                              changeStatus(banner?.template_id)
                                            }
                                          />
                                        </button>{" "}
                                        <button className="btn btn-danger">
                                          <FeatherIcon
                                            icon="trash"
                                            color="white"
                                            onClick={() =>
                                              destroyItem(banner?.template_id)
                                            }
                                          />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}

                              {bannerList.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="text-center">
                                    {Trans(
                                      "NOT_FOUND_CHOOSE_BANNER_GROUP",
                                      language
                                    )}
                                  </td>
                                </tr>
                              ) : null}
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </div>
                  )}
                </div>
              </CheckPermission>
            </div>
          </div>
        </React.Fragment>
      </CheckPermission>

      {/* add modal */}
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("ADD_EMAIL_TEMPLATE", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Create
            handleModalClose={handleModalClose}
            filterItem={filterItem}
            groupId={menuGroupId}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* edit modal */}
      <Modal show={editModalShow} onHide={handleEditModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("UPDATE_EMAIL_TEMPLATE", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Edit
            editData={editData}
            filterItem={filterItem}
            handleModalClose={handleEditModalClose}
            groupId={menuGroupId}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default EmailTemplate;
