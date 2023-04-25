import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { userUrl, deleteUserUrl } from "config";
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
// import "./style.css";
import Table from "component/Table";
import { UserView, UserManage } from "config/PermissionName";
import FeatherIcon from "feather-icons-react";

import { Modal, Button } from "react-bootstrap";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [userlist, SetUserList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("ID", language), field: "id", sort: true },
    { label: Trans("NAME", language), field: "name", sort: false },
    { label: Trans("EMAIL", language), field: "email", sort: true },
    { label: Trans("DEPT", language), field: "role_name", sort: false },
    { label: Trans("STATUS", language), field: "status", sort: false },
    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["edit", "delete"],
      sort: false,
    },
  ];

  const getUser = (pagev, perPageItemv, searchData, sortBys, OrderBy) => {
    const filterData = {
      api_token: apiToken,
      page: pagev,
      perPage: perPageItemv,
      search: searchData,
      sortBy: sortBys,
      orderBY: OrderBy,
    };
    POST(userUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetUserList(data.data);
          SetPagi(data.total_page);
          SetcurrPage(data.current_page);
        } else alert(Trans(message, language));
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
        alert(Trans(message, language));
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
    getUser(1, perPageItem, searchItem, sortByS, orderByS);
    return () => {
      getUser(1, perPageItem, searchItem, sortByS, orderByS);
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          { title: Trans("MANAGE", language), link: "", class: "" },
          { title: Trans("USER", language), link: "", class: "active" },
        ]}
        heading={Trans("USER_LIST", language)}
      />
      <div className="row">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission IsPageAccess={UserView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("USER", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <RecordPerPage
                    filterItem={filterItem}
                    perPageItem={perPageItem}
                  />
                  &nbsp;&nbsp;
                  <SearchBox filterItem={filterItem} />
                  &nbsp;&nbsp;
                  <Button variant="primary" onClick={handleModalShow}>
                    <FeatherIcon
                      icon="plus"
                      fill="white"
                      className="wd-10 mg-r-5"
                    />
                    {Trans("CREATE_USER", language)}
                  </Button>
                  &nbsp;&nbsp;
                  <ExportButton
                    column={[
                      {
                        label: Trans("NAME", language),
                        field: "dept_name",
                      },
                      { label: "DESC", field: "dept_details" },
                    ]}
                    data={userlist}
                    filename="PLAN"
                  />
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
                    <ExportButton
                      column={showColumn}
                      data={userlist}
                      filename="USER"
                    />
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
                      pageName="user" // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
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
          <Modal.Title>{Trans("CREATE_USER", language)}</Modal.Title>
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
