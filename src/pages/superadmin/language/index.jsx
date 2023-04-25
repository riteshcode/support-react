import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  languageUrl,
  languageEditUrl,
  languageDeleteUrl,
  languageChangeStatusUrl,
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
import { useForm } from "react-hook-form";
import Notify from "component/Notify";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
} from "component/UIElement/UIElement";
import { useNavigate } from "react-router-dom";
import { LanguageView } from "config/PermissionName";
import FeatherIcon from "feather-icons-react";
import {
  PageLanguage,
  PreAdd,
  PreView,
  PreExport,
} from "config/PermissionName";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [dataList, SetdataList] = useState([]);
  const navigate = useNavigate();

  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("languages_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const { register, handleSubmit } = useForm();
  // const [formloadingStatus, SetformloadingStatus] = useState(false);

  const showColumn = [
    { label: Trans("SL_NO", language), field: "sl_no", sort: true },
    { label: Trans("NAME", language), field: "languages_name", sort: true },
    { label: Trans("CODE", language), field: "languages_code", sort: false },
    { label: Trans("STATUS", language), field: "status", sort: false },
    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["edit_fun", "changeStatus"],
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
    POST(languageUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetdataList(data.data);
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
    getUser(1, perPageItem, searchItem, sortByS, orderByS);
    return () => {
      getUser(1, perPageItem, searchItem, sortByS, orderByS);
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);
  const [editData, SetEditData] = useState();

  const [TransModalshow, setTransModalShow] = useState(false);
  const handleTransModalClose = () => setTransModalShow(false);
  const handleTransModalShow = () => setTransModalShow(true);

  const editFun = (editId) => {
    const editData = {
      api_token: apiToken,
      languages_id: editId,
    };
    POST(languageEditUrl, editData)
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
  const deleteItem = (deleteID) => {
    const infoData = {
      api_token: apiToken,
      languages_id: deleteID,
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

  const ChangeFunction = (id) => {
    const editData = {
      api_token: apiToken,
      languages_id: id,
    };
    POST(languageChangeStatusUrl, editData)
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
          { title: Trans("LANGUAGE", language), link: "", class: "active" },
        ]}
        heading={Trans("LANGUAGE_LIST", language)}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageLanguage} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("LANGUAGE_LIST", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageLanguage}
                    PageAction={PreAdd}
                  >
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_LANGUAGE", language)}
                    </Button>
                    {"  "}
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
                      PageAccess={PageLanguage}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={dataList}
                        filename="Language"
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
                      pageName={PageLanguage} // for checkpermission
                      sortBy={sortByS}
                      updateStatusFunction={ChangeFunction}
                      orderBy={orderByS}
                      filterItem={filterItem}
                      editFun={editFun}
                      deleteFun={deleteItem}
                      mainKey="languages_id"
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
          <Modal.Title>{Trans("ADD_LANGUAGE", language)}</Modal.Title>
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
          <Modal.Title>{Trans("UPDATE_LANGUAGE", language)}</Modal.Title>
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