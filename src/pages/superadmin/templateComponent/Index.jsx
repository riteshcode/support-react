import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { TemplateComponentUrl, TemplateComponentChangeStatusUrl } from "config";
import {
  PageDepartment,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import Table from "./component/Table";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import AddGroup from "./AddGroup";
import EditGroup from "./EditGroup";
import ManageFeatureProduct from "./ManageFeatureProduct";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [userlist, SetUserList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("brand_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("SL_NO", language), field: "sl_no", sort: false },
    { label: Trans("BRAND_NAME", language), field: "brand_name", sort: true },
    {
      label: Trans("ICON", language),
      field: "brand_icon",
      sort: false,
    },
    { label: Trans("STATUS", language), field: "status", sort: false },
    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["edit_fun", "changeStatus"],
      sort: false,
    },
  ];

  const getUser = (pagev, perPageItemv, searchData, sortBys, OrderBy) => {
    SetloadingStatus(true);
    const filterData = {
      api_token: apiToken,
      page: pagev,
      perPage: perPageItemv,
      search: searchData,
      sortBy: sortBys,
      orderBY: OrderBy,
    };
    POST(TemplateComponentUrl, filterData)
      .then((response) => {
        console.log("response", response);
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetUserList(data.data);
          SetPagi(data.total_page);
          SetcurrPage(data.current_page);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const filterItem = (name, value, other) => {
    switch (name) {
      case "perpage":
        SetloadingStatus(true);
        const per = Number(value);
        SetPerPageItem(per);
        getUser(1, per, searchItem, sortByS, orderByS);
        break;
      case "searchbox":
        SetSEarchItem(value);
        getUser(1, perPageItem, value, sortByS, orderByS);
        break;
      case "sortby":
        SetOrderByS(other);
        SetsortByS(value);
        getUser(1, perPageItem, searchItem, value, other);
        break;
      case "pagi":
        SetcurrPage(value);
        getUser(value, perPageItem, searchItem, sortByS, orderByS);
        break;
      default:
        getUser(currPage, perPageItem, searchItem, sortByS, orderByS);
        break;
    }
  };

  const ChangeFunction = (component_id) => {
    const editData = {
      api_token: apiToken,
      component_id: component_id,
    };
    POST(TemplateComponentChangeStatusUrl, editData)
      .then((response) => {
        const { message } = response.data;
        filterItem("refresh", "", "");
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getUser(1, perPageItem, searchItem, sortByS, orderByS);
    return () => {
      abortController.abort();
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);

  const [viewModalShow, setViewModalShow] = useState(false);
  const handleViewModalClose = () => setViewModalShow(false);

  const [editData, SetEditData] = useState();

  const editFun = (updateId) => {
    SetEditData(updateId);
    setEditModalShow(true);
  };

  const viewFunction = (updateId) => {
    SetEditData(updateId);
    setViewModalShow(true);
  };

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          {
            title: Trans("TEMPLATE_COMPONENT", language),
            link: "",
            class: "active",
          },
        ]}
        heading={Trans("TEMPLATE_COMPONENT_LIST", language)}
      />

      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageDepartment} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("TEMPLATE_COMPONENT_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageDepartment}
                    PageAction={PreAdd}
                  >
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_FEATURE_GROUP", language)}
                    </Button>
                  </CheckPermission>
                </div>
              </div>

              <div className="card-body">
                {contentloadingStatus ? (
                  <Loading />
                ) : (
                  <div className="row">
                    <Table
                      showColumn={showColumn}
                      dataList={userlist}
                      pageName={PageDepartment} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editFun}
                      updateStatusFunction={ChangeFunction}
                      viewFunction={viewFunction}
                      mainKey="component_id"
                    />
                  </div>
                )}
              </div>
            </div>
          </CheckPermission>
        </div>
      </div>

      {/* add modal */}
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("ADD_FEATURE_GROUP", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <AddGroup
            filterItem={filterItem}
            handleModalClose={handleModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* edit modal */}
      <Modal show={editModalShow} onHide={handleEditModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("UPDATE_FEATURE_GROUP", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <EditGroup
            editData={editData}
            filterItem={filterItem}
            handleModalClose={handleEditModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* Manage Feature Product */}
      <Modal show={viewModalShow} onHide={handleViewModalClose} size={"lg"}>
        <Modal.Header>
          <Modal.Title>{Trans("FEATURE_PRODUCT_LIST", language)}</Modal.Title>
          <Button variant="danger" onClick={handleViewModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <ManageFeatureProduct
            editData={editData}
            filterItem={filterItem}
            handleModalClose={handleViewModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* Manage Feature Product modal */}
    </Content>
  );
}

export default Index;
