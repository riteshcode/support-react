import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import ModalImage from "react-modal-image-responsive";

import {
  BannerListUrl,
  BannerUpdateSettingUrl,
  BannerGroupUrl,
  BannerChangeStatusUrl,
  BannerDestroyUrl,
} from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Create from "./Create";

import { Col, BadgeShow, IconButton } from "component/UIElement/UIElement";
import { useForm } from "react-hook-form";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { useParams } from "react-router-dom";
import {
  PageDepartment,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import Edit from "./Edit";
import WebsiteLink from "config/WebsiteLink";
import { bannerSetting } from "config/WebsiteUrl";

function Banner() {
  const { bannerGroupId } = useParams();

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
    POST(BannerGroupUrl, filterData)
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
    findListBanner(bannerGroupId);
    return () => abortController.abort();
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  // handle change group name
  const [sectionListing, SetSectionListing] = useState([]);

  const [bannerList, SetBannerList] = useState([]);
  const [banGrpInfo, SetbanGrpInfo] = useState([]);

  const findListBanner = (id) => {
    const filterData = {
      api_token: apiToken,
      banners_group_id: id,
    };
    POST(BannerListUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        console.log("Banner list", data);
        if (status) {
          SetloadingStatus(false);
          SetBannerList(data.data_list);
          SetbanGrpInfo(data.info);
        } else Notify(true, Trans(message, language));
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  const destroyItem = (id) => {
    const filterData = {
      api_token: apiToken,
      banners_id: id,
    };
    POST(BannerDestroyUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        Notify(true, Trans(message, language));
        findListBanner(bannerGroupId);
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  const changeStatus = (id) => {
    const filterData = {
      api_token: apiToken,
      banners_id: id,
    };
    POST(BannerChangeStatusUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        Notify(true, Trans(message, language));
        findListBanner(bannerGroupId);
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);
  const [editData, SetEditData] = useState();

  const [viewModalShow, setViewModalShow] = useState(false);
  const handleViewModalClose = () => setViewModalShow(false);

  const editFunction = (updateId) => {
    SetEditData(updateId);
    setEditModalShow(true);
  };

  const filterItem = () => {
    findListBanner(bannerGroupId);
  };

  const viewFunction = (updateId) => {
    SetEditData(updateId);
    setViewModalShow(true);
  };

  const viewFun = (editId) => {
    viewFunction(editId);
  };

  return (
    <Content>
      <CheckPermission IsPageAccess="subscription.view">
        <>
          <PageHeader
            breadcumbs={[
              { title: Trans("DASHBOARD", language), link: "/", class: "" },
              {
                title: Trans("BANNER_GROUP", language),
                link: WebsiteLink(bannerSetting),
                class: "",
              },
              {
                title: banGrpInfo?.group_name,
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
                      {Trans(banGrpInfo?.group_name, language)}
                    </h6>
                    <div className="d-none d-md-flex">
                      <Button
                        variant="primary"
                        className="btn btn-info"
                        onClick={handleModalShow}
                      >
                        {Trans("ADD_BANNER", language)}
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
                                <th>{Trans("BANNER_NAME", language)}</th>
                                <th>{Trans("BANNER", language)}</th>
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
                                      <td>{banner.banners_title}</td>
                                      <td>
                                        <ModalImage
                                          small={banner.image}
                                          large={banner.image}
                                          alt={banner.banners_title}
                                          height="10"
                                          width="10"
                                          className="img50"
                                        />
                                      </td>
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
                                        <a
                                          variant="primary"
                                          href={banner?.banners_url}
                                          target="_blank"
                                        >
                                          <FeatherIcon
                                            icon="external-link"
                                            size="18"
                                          />
                                        </a>{" "}
                                        <button className="btn btn-info">
                                          <FeatherIcon
                                            icon="edit-2"
                                            fill="white"
                                            size={18}
                                            onClick={() =>
                                              editFunction(banner?.banners_id)
                                            }
                                          />
                                        </button>
                                        {"  "}
                                        <button className="btn btn-warning">
                                          <FeatherIcon
                                            icon="repeat"
                                            color="white"
                                            onClick={() =>
                                              changeStatus(banner?.banners_id)
                                            }
                                          />
                                        </button>{" "}
                                        {"  "}
                                        <button className="btn btn-danger">
                                          <FeatherIcon
                                            icon="x-square"
                                            color="white"
                                            onClick={() =>
                                              destroyItem(banner?.banners_id)
                                            }
                                          />
                                        </button>
                                        {"  "}
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
          <Modal.Title>{Trans("ADD_BANNER", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Create
            loadSettingData={loadSettingData}
            handleModalClose={handleModalClose}
            filterItem={filterItem}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* edit modal */}
      <Modal show={editModalShow} onHide={handleEditModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("UPDATE_BANNER", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Edit
            editData={editData}
            filterItem={filterItem}
            handleModalClose={handleEditModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
      {/* img modal */}
      <Modal show={viewModalShow} onHide={handleViewModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("IMAGE_URL", language)}</Modal.Title>
          <Button variant="danger" onClick={handleViewModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <img src={editData} height="200" width="400" />
        </Modal.Body>
      </Modal>
      {/*  modal */}
    </Content>
  );
}

export default Banner;
