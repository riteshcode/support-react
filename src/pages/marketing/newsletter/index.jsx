import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { NewsletterUrl, NewsletterChangeStatusUrl } from "config";
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
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { PageCategories, PreView, PreExport } from "config/PermissionName";
import { Modal, Button } from "react-bootstrap";
import ImportModal from "./component/ImportModal";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [dataList, SetdataList] = useState([]);
  const [filterDataList, SetfilterDataList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("quotation_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [ImportNewsletterModalShow
, SetImportNewsletterModalShow
] = useState(false);

  const showColumn = [
    { label: Trans("SL_NO", language), field: "quotation_id", sort: true },

    {
      label: Trans("QUOTATION_NO", language),
      field: "quotation_no",
      sort: false,
    },
    {
      label: Trans("FINAL_COST", language),
      field: "final_cost",
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
      language: language,
    };
    POST(NewsletterUrl, filterData)
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
    filterItem("refresh", "", "");
    return () => abortController.abort();
  }, []);

  const ChangeFunction = (quoteId, statusId) => {
    const editData = {
      api_token: apiToken,
      newsletter_id: quoteId,
      status: statusId,
    };
    POST(NewsletterChangeStatusUrl, editData)
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
          { title: Trans("NEWSLETTER", language), link: "", class: "active" },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageCategories} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("NEWSLETTER_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageCategories}
                    PageAction={PreView}
                  >
                    &nbsp;
                    <Button
                      variant="primary"
                      onClick={() => SetImportNewsletterModalShow
              (true)}
                    >
                      <FeatherIcon
                        icon="arrow-down-circle"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("IMPORT_NEWSLETTER", language)}
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
                      PageAccess={PageCategories}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={filterDataList}
                        filename="NEWSLETTER"
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
                      pageName={PageCategories} // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      updateStatusFunction={ChangeFunction}
                      mainKey="newsletter_id"
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

      {/* IMPORT modal */}
      <Modal
        show={ImportNewsletterModalShow
}
        onHide={() => SetImportNewsletterModalShow
(false)}
      >
        <Modal.Header>
          <Modal.Title>{Trans("IMPORT", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => SetImportNewsletterModalShow
(false)}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <ImportModal
            filterItem={filterItem}
            handleModalClose={() => SetImportNewsletterModalShow
(false)}
          />
        </Modal.Body>
      </Modal>
      {/* IMPORT end modal */}
    </Content>
  );
}

export default Index;
