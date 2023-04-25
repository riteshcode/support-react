import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  leadUrl,
  leadStatusTabUrl,
  leadStatusUrl,
  supplierDeleteUrl,
  leadCreateUrl,
} from "config";
import { PageLead, PreAdd, PreView, PreExport } from "config/PermissionName";
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
import Table from "./component/Table";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Create from "./create";
import Edit from "./edit";
import View from "./view";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import ImportModal from "./ImportModal";
import SendMail from "./SendMail";
import StatusTab from "./StatusTab";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [userlist, SetUserList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("lead_id");
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
    POST(leadUrl, filterData)
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
      quoteId: quoteId,
      statusId: statusId,
    };
    POST(leadStatusUrl, editData)
      .then((response) => {
        const { message } = response.data;
        console.log(response.data);
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
          { title: Trans("LEAD", language), link: "", class: "active" },
        ]}
        heading={Trans("LEAD_LIST", language)}
      />
      <StatusTab leaveInfo={leaveInfo} />
      <br />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageLead} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("LEAD_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission PageAccess={PageLead} PageAction={PreAdd}>
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_LEAD", language)}
                    </Button>
                  </CheckPermission>{" "}
                  <CheckPermission PageAccess={PageLead} PageAction={PreAdd}>
                    &nbsp;
                    <Button
                      variant="primary"
                      onClick={() => SetImportLeadModalShow(true)}
                    >
                      <FeatherIcon
                        icon="arrow-down-circle"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("IMPORT_LEAD", language)}
                    </Button>
                  </CheckPermission>
                  <CheckPermission PageAccess={PageLead} PageAction={PreAdd}>
                    &nbsp;
                    <Button
                      variant="primary"
                      onClick={() => SetSendMailModalShow(true)}
                    >
                      <FeatherIcon
                        icon="mail"
                        // fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("SEND_MAIL", language)}
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
                      PageAccess={PageLead}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={userlist}
                        filename={PageLead}
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
                      pageName={PageLead} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editFun}
                      viewFunction={viewFunction}
                      updateStatusFunction={ChangeFunction}
                      deleteFun={deleteFun}
                      mainKey="lead_id"
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
      <Modal show={show} onHide={handleModalClose} size="lg">
        <Modal.Header>
          <Modal.Title>{Trans("ADD_LEAD", language)}</Modal.Title>
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
          <Modal.Title>{Trans("UPDATE_LEAD", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Edit
            editData={editData}
            filterItem={filterItem}
            source={source}
            country={country}
            handleModalClose={handleEditModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
      {/* view modal */}
      <Modal show={viewModalShow} onHide={handleviewClose} size="lg">
        <Modal.Header>
          <Modal.Title>{Trans("LEAD_INFO", language)}</Modal.Title>
          <Button variant="danger" onClick={handleviewClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <View
            editData={editData}
            filterItem={filterItem}
            handleModalClose={handleviewClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default Index;
