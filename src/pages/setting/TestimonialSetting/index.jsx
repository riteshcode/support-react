import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { WebTestimonialUrl, WebTestimonialDeleteUrl, WebTestimonialChangeStatusUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Create from "./create";
import Edit from "./edit";
import RecordPerPage from "component/RecordPerPage";
import Table from "./component/Table";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { PageSetting } from 'config/WebsiteUrl';

import {
  PageCategories,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import { Anchor } from "component/UIElement/UIElement";
import WebsiteLink from "config/WebsiteLink";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [dataList, SetdataList] = useState([]);
  const [filterDataList, SetfilterDataList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("testimonial_id");
  const [orderByS, SetOrderByS] = useState("ASC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);


  const showColumn = [
    { label: Trans("SL_NO", language), field: "testimonial_id", sort: true },
    {
      label: Trans("CATEGORY_IMAGE", language),
      field: "categories_image",
      sort: true,
      field_type: "image",
    },
    {
      label: Trans("CATEGORY_NAME", language),
      field: "category_name",
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
  
    POST(WebTestimonialUrl, filterData)
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
      language: language,
    };
    POST(WebTestimonialUrl, filterData2)
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

    getData(1, perPageItem, searchItem, sortByS, orderByS);

    return () => abortController.abort();
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [showSubCat, setShowSubCat] = useState(false);
  const handleSubcatModalClose = () => setShowSubCat(false);
  const handleSubcatModalShow = () => setShowSubCat(true);

  // const [show, setShow] = useState(false);
  // const handleModalClose = () => setShow(false);
  // const handleModalShow = () => setShow(true);

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
      testimonial_id: deleteID,
    };
    POST(WebTestimonialDeleteUrl, infoData)
      .then((response) => {
        const { message } = response.data;
        filterItem("refresh", "", "");
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ChangeFunction = (update_id) => {
    const editData = {
      api_token: apiToken,
      testimonial_id: update_id,
    };
    POST(WebTestimonialChangeStatusUrl, editData)
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
          { title: Trans("TESTIMONIAL", language), link: "", class: "active" },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageCategories} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("WEB_TESTIMONIAL", language)}
                </h6>
                <div className="d-none d-md-flex">
                      <Button
                        variant="primary"
                        className="btn btn-info"
                        onClick={handleModalShow}
                      >
                        {Trans("ADD_TESTIMONIAL", language)}
                      </Button>{" "}
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
                        filename="CATEGORY"
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
                      editFun={editFun}
                      deleteFun={deleteItem}
                      updateStatusFunction={ChangeFunction}
                      mainKey="testimonial_id"
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
          <Modal.Title>{Trans("ADD_SETTING_GROUP", language)}</Modal.Title>
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
      <Modal show={editModalShow} onHide={handleEditModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("UPDATE_SETTING_GROUP", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Edit
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
