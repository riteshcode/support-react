import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { staffUrl, deleteUserUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Create from "./create";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import RecordPerPage from "component/RecordPerPage";
import Table from "./component/home/Table";
import FeatherIcon from "feather-icons-react";
import Notify from "component/Notify";
import { Modal, Button } from "react-bootstrap";
import { PageUser, PreAdd, PreView, PreExport } from "config/PermissionName";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [userlist, SetUserList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("staff_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("SL_NO", language), field: "sl_no", sort: true },
    {
      label: Trans("EMPLOYEE_ID", language),
      field: "employee_id",
      sort: false,
    },
    {
      label: Trans("STAFF_PHOTO", language),
      field: "staff_photo",
      field_type: "image",
      sort: true,
    },
    { label: Trans("STAFF_NAME", language), field: "staff_name", sort: true },
    {
      label: Trans("STAFF_EMAIL", language),
      field: "staff_email",
      sort: false,
    },
    {
      label: Trans("DEPARTMENT", language),
      field: "department_name",
      sort: false,
    },
    {
      label: Trans("DESIGNATION", language),
      field: "designation_name",
      sort: false,
    },
    {
      label: Trans("VERIFICATION_STATUS", language),
      field: "verification_status",
      sort: false,
    },
    {
      label: Trans("STATUS", language),
      field: "status",
      sort: false,
    },
    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["view"],
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
    POST(staffUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetUserList(data.data);
          SetPagi(data.total_page);
          SetcurrPage(data.current_page);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const deleteUser = (userID) => {
    const editData = {
      api_token: apiToken,
      deleteId: userID,
    };
    POST(deleteUserUrl, editData)
      .then((response) => {
        const { message } = response.data;
        filterItem("refresh", "", "");
        Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
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

  useEffect(() => {
    let abortController = new AbortController();
    getUser(1, perPageItem, searchItem, sortByS, orderByS);

    return () => abortController.abort();
  }, [perPageItem, searchItem, sortByS, orderByS]);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          { title: Trans("MANAGE", language), link: "", class: "" },
          { title: Trans("STAFF", language), link: "", class: "active" },
        ]}
        heading={Trans("STAFF_LIST", language)}
      />
      <div className="row">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageUser} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("STAFF_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission PageAccess={PageUser} PageAction={PreAdd}>
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("CREATE_STAFF", language)}
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
                      PageAccess={PageUser}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={userlist}
                        filename="User"
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
                      dataList={userlist}
                      deleteFun={deleteUser}
                      pageName={PageUser} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      mainKey="staff_id"
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
      <Modal show={show} onHide={handleModalClose} size="lg">
        <Modal.Header>
          <Modal.Title>{Trans("CREATE_STAFF", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Create filterItem={filterItem} handleModalClose={handleModalClose} />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default Index;
