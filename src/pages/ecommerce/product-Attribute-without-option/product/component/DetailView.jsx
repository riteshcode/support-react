import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  categoryUrl,
  languageDeleteUrl,
  categoryChangeStatusUrl,
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
import Create from "pages/ecommerce/category/Create";
import Edit from "pages/ecommerce/category/Edit";
import CreateSubCategory from "pages/ecommerce/category/CreateSubCategory";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import {
  PageCategories,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";
import "./DetailView.css";
function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [dataList, SetdataList] = useState([]);
  const [filterDataList, SetfilterDataList] = useState([]);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("categories_id");
  const [orderByS, SetOrderByS] = useState("ASC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("SL_NO", language), field: "categories_id", sort: true },
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
    POST(categoryUrl, filterData)
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
    POST(categoryUrl, filterData2)
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
    getData(1, perPageItem, searchItem, sortByS, orderByS);

    return () => {
      getData(1, perPageItem, searchItem, sortByS, orderByS);
    };
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

  const ChangeFunction = (industry_id) => {
    const editData = {
      api_token: apiToken,
      industry_id: industry_id,
    };
    POST(categoryChangeStatusUrl, editData)
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
          { title: Trans("CATEGORY", language), link: "", class: "active" },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageCategories} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("CATEGORY_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageCategories}
                    PageAction={PreAdd}
                  >
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_CATEGORY", language)}
                    </Button>
                  </CheckPermission>
                  {"  "}
                  <CheckPermission
                    PageAccess={PageCategories}
                    PageAction={PreAdd}
                  >
                    <Button variant="primary" onClick={handleSubcatModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_SUB_CATEGORY", language)}
                    </Button>
                  </CheckPermission>
                </div>
              </div>
              <div className="card-body">
                <table className="table table-condensed">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Main Category</th>
                      <th>Header</th>
                      <th>Header</th>
                      <th>Header</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr id="tr-detail" className="tr-detail hidden">
                      <td></td>
                      <td colspan="4">
                        <table className="table table-condensed">
                          <thead>
                            <tr>
                              <th>category</th>
                              <th>Header</th>
                              <th>Header</th>
                              <th>Header</th>
                              <th>Header</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Sub category</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                            </tr>
                            <tr>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                            </tr>
                            <tr>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                            </tr>
                          </tbody>
                        </table>
                        <table className="table table-condensed">
                          <thead>
                            <tr>
                              <th>category</th>
                              <th>Header</th>
                              <th>Header</th>
                              <th>Header</th>
                              <th>Header</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Sub category</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                            </tr>
                            <tr>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                            </tr>
                            <tr>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                              <td>123</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="fa fa-chevron-right fa-fw"></span>{" "}
                      </td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="fa fa-chevron-right fa-fw"></span>
                      </td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="fa fa-chevron-right fa-fw"></span>
                      </td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="fa fa-chevron-right fa-fw"></span>
                      </td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="fa fa-chevron-right fa-fw"></span>
                      </td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                      <td>Data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CheckPermission>
        </div>
      </div>

      {/* add modal */}
      <Modal show={show} onHide={handleModalClose} size="lg">
        <Modal.Header>
          <Modal.Title>{Trans("ADD_CATEGORY", language)}</Modal.Title>
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
          <Modal.Title>{Trans("UPDATE_CATEGORY", language)}</Modal.Title>
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

      {/* add sub category  modal */}
      <Modal show={showSubCat} onHide={handleSubcatModalClose} size="lg">
        <Modal.Header>
          <Modal.Title>{Trans("ADD_SUB_CATEGORY", language)}</Modal.Title>
          <Button variant="danger" onClick={handleSubcatModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <CreateSubCategory
            filterItem={filterItem}
            handleModalClose={handleSubcatModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default Index;
