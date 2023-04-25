import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  TempComponentSettingUrl,
  TempComponentSettingChangeStatusUrl,
  TempComponentSettingSortOrderUrl,
} from "config";
import { useParams } from "react-router-dom";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import RecordPerPage from "component/RecordPerPage";
import Table from "component/Table";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import {
  PageCategories,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import WebsiteLink from "config/WebsiteLink";
import {
  BadgeShow,
  Col,
  IconButton,
  Anchor,
} from "component/UIElement/UIElement";
import { Button } from "react-bootstrap";

function ThemeComponent() {
  const { themeId } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [dataList, SetdataList] = useState([]);
  const [themeDetail, SetThemeDetail] = useState([]);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const getData = () => {
    SetloadingStatus(true);
    const filterData = {
      api_token: apiToken,
      template_id: themeId,
    };

    POST(TempComponentSettingUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        console.log(data.child_list);
        if (status) {
          SetloadingStatus(false);
          SetdataList(data.child_list);
          SetThemeDetail(data.template_detail);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getData();
    return () => abortController.abort();
  }, []);

  const ChangeFunction = (update_id) => {
    const editData = {
      api_token: apiToken,
      setting_id: update_id,
    };
    POST(TempComponentSettingChangeStatusUrl, editData)
      .then((response) => {
        const { message } = response.data;
        getData();
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const UpdateOrderStatus = (update_id, sortOrder) => {
    const editData = {
      api_token: apiToken,
      setting_id: update_id,
      sort_order: sortOrder,
    };
    POST(TempComponentSettingSortOrderUrl, editData)
      .then((response) => {
        const { message } = response.data;
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          {
            title: Trans("THEME", language),
            link: WebsiteLink("/themes"),
            class: "",
          },
          {
            title: Trans("COMPONENT", language),
            link: "",
            class: "active",
          },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageCategories} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans(`${themeDetail?.template_name}`, language)}
                </h6>
                <span style={{ float: "right" }}>
                  <span>
                    <Anchor path={WebsiteLink("/themes")}>Go Back</Anchor>
                  </span>
                  {"  "}
                  <span>
                    <Button variant="primary" onClick={getData}>
                      <FeatherIcon icon="refresh-cw" className="wd-10 mg-r-5" />
                      {Trans("REFRESH", language)}
                    </Button>
                  </span>
                </span>
              </div>
              <div className="card-body">
                {contentloadingStatus ? (
                  <Loading />
                ) : (
                  <div className="row">
                    <div className="col-md-12">
                      {dataList.length > 0 &&
                        dataList.map((data, IDX) => {
                          return (
                            <div className="table-responsive" key={IDX}>
                              <table className="table">
                                <thead>
                                  <tr>
                                    <td colSpan={3} className="bg-info">
                                      <b>{data.component_name}</b>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.child.length > 0 &&
                                    data.child.map((cat, IDX) => {
                                      const {
                                        component_name,
                                        setting_id,
                                        statusCheck,
                                        sortOrder,
                                      } = cat;
                                      return (
                                        <React.Fragment key={IDX}>
                                          <tr>
                                            <td>{component_name}</td>
                                            <td></td>
                                            <td className="text-right">
                                              {"  "}
                                              <BadgeShow
                                                type={
                                                  statusCheck === 1
                                                    ? "active"
                                                    : "deactive"
                                                }
                                                content={
                                                  statusCheck === 1
                                                    ? "enable"
                                                    : "disable"
                                                }
                                              />
                                              {"  "}
                                              <input
                                                type="number"
                                                name=""
                                                id=""
                                                style={{ width: "50px" }}
                                                defaultValue={sortOrder}
                                                onBlur={(e) => {
                                                  UpdateOrderStatus(
                                                    setting_id,
                                                    e.target.value
                                                  );
                                                }}
                                              />
                                              {"  "}
                                              <span
                                                onClick={() =>
                                                  ChangeFunction(setting_id)
                                                }
                                              >
                                                <FeatherIcon
                                                  icon={
                                                    statusCheck === 0
                                                      ? "toggle-left"
                                                      : "toggle-right"
                                                  }
                                                  size={30}
                                                  color={
                                                    statusCheck === 0
                                                      ? "red"
                                                      : "green"
                                                  }
                                                />
                                              </span>
                                            </td>
                                          </tr>
                                        </React.Fragment>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CheckPermission>
        </div>
      </div>
    </Content>
  );
}

export default ThemeComponent;
