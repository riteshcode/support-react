import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  CRMTicketUrl,
  leadStatusTabUrl,
  CRMTicketStatusUrl,
  supplierDeleteUrl,
  leadCreateUrl,
} from "config";
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
import Create from "./create";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import RecordPerPage from "component/RecordPerPage";
// import './style.css'
import Table from "./component/Table";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";

import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";

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
    { label: Trans("SL_NO", language), field: "sl_no", sort: false },
    {
      label: Trans("COMPANY_NAME", language),
      field: "company_name",
      sort: false,
    },
    { label: Trans("COMPANY_PHONE", language), field: "phone", sort: false },
    { label: Trans("PRIORITY", language), field: "priority", sort: false },
    { label: Trans("FOLLOW_UP", language), field: "folllow_up", sort: false },
    {
      label: Trans("FOLLOW_DATE", language),
      field: "folloup_date",
      sort: false,
    },
    // {
    //   label: Trans("INDUSTRY", language),
    //   field: "industry_id",
    //   sort: false,
    // },

    {
      label: Trans("FOLLOW_UP_STATUS", language),
      field: "status",
      sort: false,
    },
    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["view_fun", "edit_fun"],
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
    POST(CRMTicketUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetUserList(data.data);
          SetPagi(data.total_page);
          SetcurrPage(data.current_page);
        } else Notify(false, message);
      })
      .catch((error) => {});

    const filterData2 = {
      api_token: apiToken,
    };
    POST(leadStatusTabUrl, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          setLeaveInfo(data);
        } else Notify(false, message);
      })
      .catch((error) => {
        Notify(false, error.message);
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

  const ChangeFunction = (quoteId, statusId) => {
    const editData = {
      api_token: apiToken,
      id: quoteId,
      status: statusId,
    };
    POST(CRMTicketStatusUrl, editData)
      .then((response) => {
        const { message } = response.data;
        filterItem("refresh", "", "");
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteFun = (deleteId) => {
    const editData = {
      api_token: apiToken,
      deleteId: deleteId,
    };
    POST(supplierDeleteUrl, editData)
      .then((response) => {
        const { message } = response.data;
        filterItem("refresh", "", "");
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [leaveInfo, setLeaveInfo] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();

    getData(1, perPageItem, searchItem, sortByS, orderByS);

    return () => {
      abortController.abort();
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);
  const [editData, SetEditData] = useState();

  const editFun = (updateId) => {
    SetEditData(updateId);
    setEditModalShow(true);
  };

  const [ImportLeadModalShow, SetImportLeadModalShow] = useState(false);
  const [SendMailModalShow, SetSendMailModalShow] = useState(false);

  const [source, SetSource] = useState([]);
  const [industry, SetIndustry] = useState([]);
  const [status, SetStatus] = useState([]);
  const [agent, SetAgent] = useState([]);
  const [country, SetCountry] = useState([]);
  const LoadSelectItem = () => {
    const formData = {
      api_token: apiToken,
    };
    POST(leadCreateUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetSource(data?.leadsource);
          SetIndustry(data?.industrydata);
          SetStatus(data?.leadstatus);
          SetAgent(data?.crmagentdata);
          SetCountry(data?.countrydata);
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    LoadSelectItem();
    return () => abortController.abort();
  }, []);

  const viewFunction = (view_id) => {
    SetEditData(view_id);
    SetViewModalShow(true);
  };
  const [viewModalShow, SetViewModalShow] = useState(false);
  const handleviewClose = () => SetViewModalShow(false);

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          { title: Trans("TICKET", language), link: "", class: "active" },
        ]}
        heading={Trans("TICKET_LIST", language)}
      />

      <br />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageDepartment} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("TICKET_LIST", language)}
                </h6>

                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageDepartment}
                    PageAction={PreAdd}
                  ></CheckPermission>{" "}
                </div>
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
                      {Trans("ADD_TICKET", language)}
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
                      PageAccess={PageDepartment}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={userlist}
                        filename={PageDepartment}
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
                      pageName={PageDepartment} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editFun}
                      viewFunction={viewFunction}
                      updateStatusFunction={ChangeFunction}
                      deleteFun={deleteFun}
                      mainKey="id"
                      leadStatus={status}
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
          <Modal.Title>{Trans("ADD_TICKET", language)}</Modal.Title>
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
