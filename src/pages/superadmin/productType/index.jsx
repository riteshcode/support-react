import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { paymentTypeUrl, languageDeleteUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import TreeComponent from "./component/index/TreeComponent";

import { Modal, Button } from "react-bootstrap";
import AddProductType from "./AddProductType";
import AddFieldGroup from "./AddFieldGroup";
import AddField from "./AddField";

import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { PageModule, PreAdd, PreView } from "config/PermissionName";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [dataList, SetdataList] = useState([]);

  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("product_type_id");
  const [orderByS, SetOrderByS] = useState("ASC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

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
    POST(paymentTypeUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        console.log("data", data);
        if (status) {
          SetloadingStatus(false);
          SetdataList(data);
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
    getData(1, perPageItem, searchItem, sortByS, orderByS);

    return () => abortController.abort();
  }, []);

  const [addModuleShow, setAddModuleShow] = useState(false);
  const handleModalClose = () => setAddModuleShow(false);
  const handleModalShow = () => setAddModuleShow(true);

  const [addSubModuleShow, SetSubAddModuleShow] = useState(false);
  const handleSubModuleModalClose = () => SetSubAddModuleShow(false);
  const handleSubModuleModalShow = () => SetSubAddModuleShow(true);

  const [addFieldShow, SetAddFieldShow] = useState(false);
  const handleAddFieldModalClose = () => SetAddFieldShow(false);
  const handleAddFieldModalShow = () => SetAddFieldShow(true);

  const editFun = (editId) => {
    // setEditModalShow(true);
    // SetEditData(editId);
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
          {
            title: Trans("PRODUCT_TYPE_FIELD_MANAGEMENT", language),
            link: "",
            class: "active",
          },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageModule} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("PRODUCT_TYPE_FIELD_MANAGEMENT", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission PageAccess={PageModule} PageAction={PreAdd}>
                    <Button variant="primary" onClick={handleModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_PRODUCT_TYPE", language)}
                    </Button>
                  </CheckPermission>
                  &nbsp;
                  <CheckPermission PageAccess={PageModule} PageAction={PreAdd}>
                    <Button
                      variant="primary"
                      onClick={handleSubModuleModalShow}
                    >
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_FIELD_GROUP", language)}
                    </Button>
                  </CheckPermission>
                  &nbsp;
                  <CheckPermission PageAccess={PageModule} PageAction={PreAdd}>
                    <Button variant="primary" onClick={handleAddFieldModalShow}>
                      <FeatherIcon
                        icon="plus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("ADD_FIELD", language)}
                    </Button>
                  </CheckPermission>
                  &nbsp;
                  <CheckPermission PageAccess={PageModule} PageAction={PreAdd}>
                    <Button
                      variant="primary"
                      onClick={() => filterItem("refresh", "", "")}
                    >
                      <FeatherIcon
                        icon="refresh-cw"
                        // fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("REFRESH", language)}
                    </Button>
                  </CheckPermission>
                </div>
              </div>
              <div className="card-body">
                {contentloadingStatus ? (
                  <Loading />
                ) : (
                  <div className="row">
                    <TreeComponent
                      filterItem={filterItem}
                      dataList={dataList}
                    />
                  </div>
                )}
              </div>
            </div>
          </CheckPermission>
        </div>
      </div>
      {/* AddProductType modal */}
      <Modal show={addModuleShow} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("ADD_PRODUCT_TYPE", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <AddProductType
            filterItem={filterItem}
            handleModalClose={handleModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
      {/* AddFieldsGroup modal */}
      <Modal show={addSubModuleShow} onHide={handleSubModuleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("ADD_FIELD_GROUP", language)}</Modal.Title>
          <Button variant="danger" onClick={handleSubModuleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <AddFieldGroup
            filterItem={filterItem}
            handleModalClose={handleSubModuleModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* AddField modal */}
      <Modal show={addFieldShow} onHide={handleAddFieldModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("ADD_FIELD", language)}</Modal.Title>
          <Button variant="danger" onClick={handleAddFieldModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <AddField
            filterItem={filterItem}
            handleModalClose={handleAddFieldModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default Index;
