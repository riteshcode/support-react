import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { leaveUrl, departmentEditUrl, leaveStatusUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import RecordPerPage from "component/RecordPerPage";
import Table from "./Table";
import { Modal, Button } from "react-bootstrap";
import LeaveApplication from "./LeaveApplication";
import Notify from "component/Notify";
import LeaveType from "./LeaveType";
import FeatherIcon from "feather-icons-react";
import CheckPermission from "helper";
import { PageLeave, PreAdd, PreView, PreExport } from "config/PermissionName";

function Index() {
  const { apiToken, language, role } = useSelector((state) => state.login);
  const [dataList, SetdataList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("leave_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("ID", language), field: "leave_id", sort: true },
    { label: Trans("subject", language), field: "subject", sort: true },
    { label: Trans("reason", language), field: "reason", sort: false },
    { label: Trans("From", language), field: "from_date", sort: false },
    { label: Trans("To", language), field: "to_date", sort: false },
    { label: Trans("STATUS", language), field: "status", sort: false },
  ];

  const getList = (pagev, perPageItemv, searchData, sortBys, OrderBy) => {
    const filterData = {
      api_token: apiToken,
      page: pagev,
      perPage: perPageItemv,
      search: searchData,
      sortBy: sortBys,
      orderBY: OrderBy,
    };
    POST(leaveUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetdataList(data.data);
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
        getList(1, per, searchItem, sortByS, orderByS);
        break;
      case "searchbox":
        SetSEarchItem(value);
        getList(1, perPageItem, value, sortByS, orderByS);
        break;
      case "sortby":
        SetOrderByS(other);
        SetsortByS(value);
        getList(1, perPageItem, searchItem, value, other);
        break;
      case "pagi":
        SetcurrPage(value);
        getList(value, perPageItem, searchItem, sortByS, orderByS);
        break;
      default:
        getList(currPage, perPageItem, searchItem, sortByS, orderByS);
        break;
    }
  };

  const updateStatusFunction = (updateId, status) => {
    const editData = {
      api_token: apiToken,
      updateId: updateId,
      status: status,
    };
    POST(leaveStatusUrl, editData)
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

    getList(1, perPageItem, searchItem, sortByS, orderByS);
    return () => {
      abortController.abort();
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  // const [editModalShow, setEditModalShow] = useState(false);
  // const handleEditModalClose = () => setEditModalShow(false);
  // const [editData, SetEditData] = useState();

  const editFun = (updateId) => {
    const editData = {
      api_token: apiToken,
      updateId: updateId,
    };
    POST(departmentEditUrl, editData)
      .then((response) => {
        // const { message, data } = response.data;
        // SetEditData(data);
        // setEditModalShow(true);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };
  const breadcrumb = [
    {
      title: Trans("DASHBOARD", "en"),
      link: "/",
      class: "",
    },
    {
      title: Trans("LEAVE", "en"),
      link: "/",
      class: "active",
    },
  ];
  return (
    <Content>
      {/* // show leave type if login user not amdin */}
      {role === "admin" || role === "superadmin" ? (
        <PageHeader
          breadcumbs={breadcrumb}
          heading={`${role} ${Trans("LEAVE_DASH", language)}`}
        />
      ) : (
        <PageHeader
          breadcumbs={breadcrumb}
          heading={Trans("LEAVE_DASH", language)}
        />
      )}

      <LeaveType />
      <br />

      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageLeave} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("LEAVE_APPLICATION_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission PageAccess={PageLeave} PageAction={PreAdd}>
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("APPLY_FOR_LEAVE", language)}
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
                      PageAccess={PageLeave}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={dataList}
                        filename={PageLeave}
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
                      pageName={PageLeave} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editFun}
                      updateStatusFunction={updateStatusFunction}
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

      {/* add leave application modal */}
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("LEAVE_APPLICATION", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <LeaveApplication
            handleModalClose={handleModalClose}
            filterItem={filterItem}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default Index;

