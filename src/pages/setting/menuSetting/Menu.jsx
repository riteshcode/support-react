import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  MenuListUrl,
  BannerUpdateSettingUrl,
  MenuGroupUrl,
  MenuChangeStatusUrl,
  MenuDestroyUrl,
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
import { useForm } from "react-hook-form";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { useParams } from "react-router-dom";
import { MenuSetting } from 'config/WebsiteUrl';

import {
  PageDepartment,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import Edit from "./Edit";
import WebsiteLink from "config/WebsiteLink";

function Menu() {
  const { menuGroupId } = useParams();

  const { apiToken, language, userType } = useSelector((state) => state.login);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const methods = useForm({
    defaultValues: {
      settingdata: [
        {
          banner_setting_id: 1,
          template_id: 1,
          refrence_id: "asdsad",
          banner_position_id: "",
          images_id: "",
          comment: 1,
        },
      ],
    },
  });

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
    POST(MenuListUrl, filterData)
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
      menu_id: id,
    };
    POST(MenuDestroyUrl, filterData)
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
      menu_id: id,
    };
    POST(MenuChangeStatusUrl, filterData)
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
        <>
          <PageHeader
            breadcumbs={[
              { title: Trans("DASHBOARD", language), link: "/", class: "" },
              {
                title: Trans("MENU_GROUP", language),
                link: WebsiteLink(MenuSetting),
                class: "",
              },
              {
                title: Trans("MENU", "language"),
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
                      {Trans("MENU_LIST", language)}
                    </h6>
                    <div className="d-none d-md-flex">
                      <Button
                        variant="primary"
                        className="btn btn-info"
                        onClick={handleModalShow}
                      >
                        {Trans("ADD_MENU", language)}
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
                                <th>{Trans("MENU_NAME", language)}</th>
                                <th>{Trans("MENU_TYPE", language)}</th>
                                <th>{Trans("MENU_LINK", language)}</th>
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
                                      <td>{banner.menu_name}</td>
                                      <td>
                                        {banner.menu_type === 1
                                          ? "Category"
                                          : banner.menu_type === 2
                                          ? "Page"
                                          : "Custome Link"}
                                      </td>
                                      <td>{banner.menu_link}</td>

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
                                              editFunction(banner?.menu_id)
                                            }
                                          />
                                        </button>
                                        {"  "}
                                        <button className="btn btn-warning">
                                          <FeatherIcon
                                            icon="repeat"
                                            color="white"
                                            onClick={() =>
                                              changeStatus(banner?.menu_id)
                                            }
                                          />
                                        </button>{" "}
                                        <button className="btn btn-danger">
                                          <FeatherIcon
                                            icon="x-square"
                                            color="white"
                                            onClick={() =>
                                              destroyItem(banner?.menu_id)
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
        </>
      </CheckPermission>

      {/* add modal */}
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("ADD_MENU", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Create
            loadSettingData={loadSettingData}
            handleModalClose={handleModalClose}
            filterItem={filterItem}
            menuGroupId={menuGroupId}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* edit modal */}
      <Modal show={editModalShow} onHide={handleEditModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("UPDATE_MENU", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Edit
            editData={editData}
            filterItem={filterItem}
            handleModalClose={handleEditModalClose}
            menuGroupId={menuGroupId}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default Menu;
