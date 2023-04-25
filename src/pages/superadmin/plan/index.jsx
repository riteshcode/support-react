import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { planUrl, planChangeStatusUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import RecordPerPage from "component/RecordPerPage";
// import './style.css'
import Table from "component/Table";
import { Modal, Button } from "react-bootstrap";
import Create from "./create";
import Edit from "./edit";
import FeatherIcon from "feather-icons-react";
import { PagePlan, PreAdd, PreView, PreExport } from "config/PermissionName";
import Notify from "component/Notify";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [userlist, SetUserList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("plan_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("SL_NO", language), field: "sl_no", sort: true },
    { label: Trans("PLAN_NAME", language), field: "plan_name", sort: true },
    { label: Trans("INDUSTRY", language), field: "industry_name", sort: true },
    { label: Trans("AMOUNT", language), field: "plan_amount", sort: false },
    {
      label: Trans("DURATION", language),
      field: "plan_duration",
      sort: false,
    },
    {
      label: Trans("DISCOUNT_TYPE", language),
      field: "discount_type",
      sort: false,
    },
    {
      label: Trans("DISCOUNT", language),
      field: "plan_discount",
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
    POST(planUrl, filterData)
      .then((response) => {
        console.log(response);
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

  useEffect(() => {
    let abortController = new AbortController();
    getUser(1, perPageItem, searchItem, sortByS, orderByS);

    return () => {
      getUser(1, perPageItem, searchItem, sortByS, orderByS);
      abortController.abort();
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);
  const [editPlanData, SetEditPlanData] = useState();

  const editPlan = (planId) => {
    setEditModalShow(true);
    SetEditPlanData(planId);
  };

  const ChangeFunction = (plan_id) => {
    const editData = {
      api_token: apiToken,
      plan_id: plan_id,
    };
    POST(planChangeStatusUrl, editData)
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
          { title: Trans("PLAN", language), link: "", class: "active" },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PagePlan} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("PLAN_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission PageAccess={PagePlan} PageAction={PreAdd}>
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_PLAN", language)}
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
                      PageAccess={PagePlan}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={userlist}
                        filename="PLAN"
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
                      pageName={PagePlan} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editPlan}
                      updateStatusFunction={ChangeFunction}
                      mainKey="plan_id"
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
          <Modal.Title>{Trans("ADD_PLAN", language)}</Modal.Title>
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
          <Modal.Title>{Trans("EDIT_PLAN", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Edit
            editData={editPlanData}
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
