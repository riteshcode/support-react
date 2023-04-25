import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { subscriberUrl, subscriberChangeStatusUrl } from "config";
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
import { Modal, Button } from "react-bootstrap";
import Create from "./create";
import Edit from "./edit";
import FeatherIcon from "feather-icons-react";
import {
  PageSubscriber,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import Notify from "component/Notify";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [dataList, SetDataList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("business_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(false);

  const showColumn = [
    { label: Trans("SL_NO", language), field: "sl_no", sort: true },
    {
      label: Trans("BUSINESS_ID", language),
      field: "business_unique_id",
      sort: true,
      linkTo: "/subscription/:id",
      linkId: "business_unique_id",
    },
    {
      label: Trans("NAME", language),
      field: "business_name",
      sort: true,
      linkTo: "/subscription/:id",
      linkId: "business_unique_id",
    },
    { label: Trans("EMAIL", language), field: "business_email", sort: true },
    {
      label: Trans("COUNTRY", language),
      field: "business_country",
      sort: false,
    },
    {
      label: Trans("TOTAL_SUBSCRIPTION", language),
      field: "total_subscription",
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

  const getData = (pagev, perPageItemv, searchData, sortBys, OrderBy) => {
    SetloadingStatus(true);
    const filterData = {
      api_token: apiToken,
      page: pagev,
      perPage: perPageItemv,
      search: searchData,
      sortBy: sortBys,
      orderBY: OrderBy,
    };
    POST(subscriberUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetDataList(data.data);
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
        getData(1, per, searchItem, sortByS, orderByS);
        break;
      case "searchbox":
        SetSEarchItem(value);
        getData(1, perPageItem, value, sortByS, orderByS);
        break;
      case "sortby":
        SetOrderByS(other);
        SetsortByS(value);
        getData(1, perPageItem, searchItem, value, other);
        break;
      case "pagi":
        SetcurrPage(value);
        getData(value, perPageItem, searchItem, sortByS, orderByS);
        break;
      default:
        getData(currPage, perPageItem, searchItem, sortByS, orderByS);
        break;
    }
  };

  useEffect(() => {
    let abortController = new AbortController();
    getData(1, perPageItem, searchItem, sortByS, orderByS);

    return () => {
      getData(1, perPageItem, searchItem, sortByS, orderByS);
      abortController.abort();
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);
  const [editData, SetEditData] = useState();

  const editPlan = (business_id) => {
    setEditModalShow(true);
    SetEditData(business_id);
  };

  const ChangeFunction = (business_id) => {
    const editData = {
      api_token: apiToken,
      business_id: business_id,
    };
    POST(subscriberChangeStatusUrl, editData)
      .then((response) => {
        const { message } = response.data;
        filterItem("refresh", "", "");
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
            title: Trans("SUBCRIBER_BUSINESS", language),
            link: "",
            class: "active",
          },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageSubscriber} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("SUBCRIBER_BUSINESS_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageSubscriber}
                    PageAction={PreAdd}
                  >
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_BUSINESS", language)}
                    </Button>
                  </CheckPermission>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-2">
                    <RecordPerPage
                      filterItem={filterItem}
                      perPageItem={perPageItem}
                    />
                  </div>
                  <div className="col-md-5">
                    <SearchBox filterItem={filterItem} />
                  </div>
                  <div className="col-md-5 text-right">
                    <CheckPermission
                      PageAccess={PageSubscriber}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={dataList}
                        filename={PageSubscriber}
                      />
                    </CheckPermission>
                  </div>
                </div>
                {contentloadingStatus ? (
                  <Loading />
                ) : (
                  <div className="row">
                    <Table
                      showColumn={showColumn}
                      dataList={dataList}
                      pageName={PageSubscriber} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editPlan}
                      updateStatusFunction={ChangeFunction}
                      mainKey="business_id"
                    />
                    <Pagination
                      totalPage={Pagi}
                      currPage={currPage}
                      filterItem={filterItem}
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
          <Modal.Title>{Trans("ADD_BUSINESS", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Create filterItem={filterItem} handleModalClose={handleModalClose} />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* edit modal */}
      <Modal show={editModalShow} onHide={handleEditModalClose} size="lg">
        <Modal.Header>
          <Modal.Title>{Trans("EDIT_BUSINESS", language)}</Modal.Title>
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
    </Content>
  );
}

export default Index;
