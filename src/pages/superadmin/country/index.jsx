import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  countryUrl,
  countryEditUrl,
  languageDeleteUrl,
  currencyUrlAll,
  languageUrlAll,
  timezoneUrlAll,
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
import Table from "component/Table";
import { Modal, Button } from "react-bootstrap";
import Create from "./create";
import Edit from "./edit";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { PageCountry, PreAdd, PreView, PreExport } from "config/PermissionName";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [dataList, SetdataList] = useState([]);
  const [filterDataList, SetfilterDataList] = useState([]);
  const [currencyList, SetCurrencyList] = useState([]);
  const [languageList, SetLanguageList] = useState([]);
  const [timezoneList, SetTimezoneList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("countries_name");
  const [orderByS, SetOrderByS] = useState("ASC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("SL_NO", language), field: "sl_no", sort: true },
    {
      label: Trans("COUNTRY_NAME", language),
      field: "countries_name",
      sort: true,
    },
    {
      label: Trans("COUNTRIES_ISO_CODE_2", language),
      field: "countries_iso_code_2",
      sort: false,
    },
    {
      label: Trans("COUNTRIES_ISO_CODE_3", language),
      field: "countries_iso_code_3",
      sort: false,
    },
    {
      label: Trans("CURRENCY", language),
      field: "currency_code",
      sort: false,
    },
    {
      label: Trans("TIME_ZONE", language),
      field: "timezone_location",
      sort: false,
    },
    { label: Trans("UTC_TIME", language), field: "utc_time", sort: false },
    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["edit_fun"],
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
    POST(countryUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetdataList(data.data);
          SetPagi(data.total_page);
          SetcurrPage(data.current_page);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });

    // For filter data exportss
    const filterData2 = {
      api_token: apiToken,
      perPage: 500,
      search: searchData,
    };
    POST(countryUrl, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetfilterDataList(data.data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        // Notify(false, Trans(error.message, language));
      });

    POST(currencyUrlAll, {
      api_token: apiToken,
    })
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetCurrencyList(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });

    POST(languageUrlAll, {
      api_token: apiToken,
    })
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetLanguageList(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });

    POST(timezoneUrlAll, {
      api_token: apiToken,
    })
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetTimezoneList(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
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
    getData(1, perPageItem, searchItem, sortByS, orderByS);

    return () => {
      getData(1, perPageItem, searchItem, sortByS, orderByS);
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);
  const [editData, SetEditData] = useState();

  const editFun = (editId) => {
    setEditModalShow(true);
    SetEditData(editId);
  };
  const deleteItem = (deleteID) => {
    const infoData = {
      api_token: apiToken,
      countries_id: deleteID,
    };
    POST(languageDeleteUrl, infoData)
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
          { title: Trans("COUNTRY", language), link: "", class: "active" },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageCountry} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("COUNTRY_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission PageAccess={PageCountry} PageAction={PreAdd}>
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_COUNTRY", language)}
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
                      PageAccess={PageCountry}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={filterDataList}
                        filename="Country"
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
                      pageName={PageCountry} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editFun}
                      deleteFun={deleteItem}
                      mainKey="countries_id"
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
          <Modal.Title>{Trans("ADD_COUNTRY", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Create
            currencyList={currencyList}
            languageList={languageList}
            timezoneList={timezoneList}
            filterItem={filterItem}
            handleModalClose={handleModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* edit modal */}
      <Modal show={editModalShow} onHide={handleEditModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("UPDATE_COUNTRY", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Edit
            currencyList={currencyList}
            timezoneList={timezoneList}
            languageList={languageList}
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
