import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  customerUrl,
  leadStatusTabUrl,
  leadStatusUrl,
  supplierDeleteUrl,
  customerCreateUrl,
} from "config";
import {
  PageCustomer,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import RecordPerPage from "component/RecordPerPage";
import Table from "./component/Table";
import { Modal, Button } from "react-bootstrap";
import Create from "./create";
import Edit from "./edit";
import View from "./view";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [userlist, SetUserList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("customer_id");
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
    { label: Trans("WEBSITE", language), field: "website", sort: false },

    {
      label: Trans("CUSTOMER_NAME", language),
      field: "contact_name",
      sort: false,
    },
    {
      label: Trans("EMAIL", language),
      field: "contact_email",
      sort: false,
    },

    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["edit_fun", "view_fun"],
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
    POST(customerUrl, filterData)
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

    LoadSelectItem();
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

  const ChangeFunction = (supplier_id) => {
    const editData = {
      api_token: apiToken,
      supplier_id: supplier_id,
    };
    POST(leadStatusUrl, editData)
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

  const [source, SetSource] = useState([]);
  const [country, SetCountry] = useState([]);
  const LoadSelectItem = () => {
    const formData = {
      api_token: apiToken,
    };
    POST(customerCreateUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetSource(data?.lead);
          SetCountry(data?.country);
        } else Notify(false, Trans("HAVING_ISSUE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE", language));
      });
  };

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
          { title: Trans("CUSTOMER", language), link: "", class: "active" },
        ]}
        heading={Trans("CUSTOMER_LIST", language)}
      />

      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageCustomer} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("CUSTOMER_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageCustomer}
                    PageAction={PreAdd}
                  >
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_CUSTOMER", language)}
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
                      PageAccess={PageCustomer}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={userlist}
                        filename={PageCustomer}
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
                      pageName={PageCustomer} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editFun}
                      viewFunction={viewFunction}
                      updateStatusFunction={ChangeFunction}
                      deleteFun={deleteFun}
                      mainKey="customer_id"
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
          <Modal.Title>{Trans("ADD_CUSTOMER", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Create
            source={source}
            country={country}
            filterItem={filterItem}
            handleModalClose={handleModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
      {/* edit modal */}
      <Modal show={editModalShow} onHide={handleEditModalClose} size="lg">
        <Modal.Header>
          <Modal.Title>{Trans("UPDATE_CUSTOMER", language)}</Modal.Title>
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

      {/* edit modal */}
      <Modal show={viewModalShow} onHide={handleviewClose} size="lg">
        <Modal.Header>
          <Modal.Title>{Trans("CUSTOMER_INFO", language)}</Modal.Title>
          <Button variant="danger" onClick={handleviewClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <View
            editData={editData}
            filterItem={filterItem}
            source={source}
            country={country}
            handleModalClose={handleviewClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default Index;
