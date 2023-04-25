import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  subscriptionEditUrl,
  subscriptionUrl,
  subscriptionStatusChangeUrl,
} from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import RecordPerPage from "component/RecordPerPage";
import { Button, Modal } from "react-bootstrap";
import Table from "component/Table";
import Edit from "./edit";
import { SubscriptionView } from "config/PermissionName";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [userlist, SetUserList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("subscription_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("ID", language), field: "subscription_id", sort: true },
    {
      label: Trans("UniID", language),
      field: "subscription_unique_id",
      sort: true,
      linkTo: "view/:id",
      linkId: "subscription_id",
    },
    {
      label: Trans("SUBS_NAME", language),
      field: "subscriber_name",
      sort: false,
      linkTo: "/superadmin/subscriber/view/:id",
      linkId: "subscriber_id",
    },
    { label: Trans("STATUS", language), field: "status", sort: false },
    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["edit_fun", "view", "changeStatus"],
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
    POST(subscriptionUrl, filterData)
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

  const ChangeFunction = (subscription_id) => {
    const editData = {
      api_token: apiToken,
      subscription_id: subscription_id,
    };
    POST(subscriptionStatusChangeUrl, editData)
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

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);
  const [editData, SetEditData] = useState();

  const editModule = (editId) => {
    const editData = {
      api_token: apiToken,
      edit_id: editId,
    };
    POST(subscriptionEditUrl, editData)
      .then((response) => {
        const { data } = response.data;
        SetEditData(data);
        setEditModalShow(true);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", "en"), link: "/", class: "" },
          { title: Trans("subs_user", "en"), link: "", class: "active" },
        ]}
        heading={Trans("subs_user_list", "en")}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission IsPageAccess={SubscriptionView}>
            <div className="card" id="custom-user-list">
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
                      column={[
                        { label: "Name", field: "name" },
                        { label: "Email", field: "email" },
                        { label: "Status", field: "status" },
                      ]}
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
                      updateStatusFunction={ChangeFunction}
                      pageName="subscription" // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editModule}
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

      {/* edit modal */}
      <Modal show={editModalShow} onHide={handleEditModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("EDIT_SUBSCRIPTION", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Edit
            data={editData}
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
