import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import PageHeader from "component/PageHeader";
import Content from "layouts/content";
import { roleUrl, deleteRoleUrl } from "config";
import Create from "./create";
import Edit from "./Edit";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import RecordPerPage from "component/RecordPerPage";
import { Col, BadgeShow, Anchor } from "component/UIElement/UIElement";
// import "./style.css";
import FeatherIcon from "feather-icons-react";
import { PageRole, PreAdd, PreView, PreExport } from "config/PermissionName";

import { Modal, Button, Row } from "react-bootstrap";
import Notify from "component/Notify";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [rolelist, SetRoleList] = useState([]);

  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("roles_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("SL_NO", language), field: "sl_no", sort: true },
    { label: Trans("NAME", language), field: "roles_name", sort: true },
    {
      label: Trans("PERMISSION", language),
      field: "permissionList",
      sort: false,
    },
    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["edit_fun", "delete"],
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
    POST(roleUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetRoleList(data.data);
          SetPagi(data.total_page);
          SetcurrPage(data.current_page);
        } else Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const deleteRole = (roleID) => {
    const editData = {
      api_token: apiToken,
      deleteId: roleID,
    };
    POST(deleteRoleUrl, editData)
      .then((response) => {
        const { message } = response.data;
        filterItem("refresh", "", "");
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [EditRoleID, SetEditRoleID] = useState();

  const editRoleTe = (roleId) => {
    SeteditShow(true);
    SetEditRoleID(roleId);
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
  const [editShow, SeteditShow] = useState(false);
  const edithandleModalClose = () => SeteditShow(false);

  return (
    <>
      <Content>
        <PageHeader
          breadcumbs={[
            { title: Trans("DASHBOARD", language), link: "/", class: "" },
            { title: Trans("MANAGE", language), link: "", class: "" },
            { title: Trans("ROLES", language), link: "", class: "active" },
          ]}
          heading={Trans("ROLE_LIST", language)}
        />
        <div className="row row-xs">
          <div className="col-sm-12 col-lg-12">
            <CheckPermission PageAccess={PageRole} PageAction={PreView}>
              <div className="card">
                <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                  <h6 className="tx-uppercase tx-semibold mg-b-0">
                    {Trans("ROLE", language)}
                  </h6>
                  <div className="d-none d-md-flex">
                    <CheckPermission PageAccess={PageRole} PageAction={PreAdd}>
                      <Button variant="primary" onClick={handleModalShow}>
                        <FeatherIcon
                          icon="plus"
                          fill="white"
                          className="wd-10 mg-r-5"
                        />
                        {Trans("CREATE_ROLE", language)}
                      </Button>
                    </CheckPermission>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2">
                      <RecordPerPage
                        filterItem={rolelist}
                        perPageItem={perPageItem}
                      />
                    </div>
                    <div className="col-md-5">
                      <SearchBox filterItem={filterItem} />
                    </div>
                    <div className="col-md-5 text-right">
                      <CheckPermission
                        PageAccess={PageRole}
                        PageAction={PreExport}
                      >
                        <ExportButton
                          column={showColumn}
                          data={rolelist}
                          filename="Role"
                        />
                      </CheckPermission>
                    </div>
                  </div>
                  {contentloadingStatus ? (
                    <Loading />
                  ) : (
                    <div className="card-body">
                      <Row>
                        <Col col={12}>
                          <div className="table-responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>{Trans("SL_NO", language)}</th>
                                  <th className="text-center">
                                    {Trans("NAME", language)}
                                  </th>
                                  <th className="text-center">
                                    {Trans("PERMISSION", language)}
                                  </th>
                                  <th className="text-center">
                                    {Trans("ACTION", language)}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {rolelist &&
                                  rolelist.map((role, idx) => {
                                    return (
                                      <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td className="text-center">
                                          {role.roles_name} ({role.userCount})
                                        </td>
                                        <td className="text-center">
                                          <ul className="permissionList">
                                            {role.permissionList &&
                                              role.permissionList.map(
                                                (section, skey) => {
                                                  return (
                                                    <React.Fragment key={skey}>
                                                      {section.permissions &&
                                                        section.permissions.map(
                                                          (perm, pidx) => {
                                                            return (
                                                              <li key={pidx}>
                                                                {`
                                                                ${perm.permissions_name} ${section.section_name} ( ${perm.permission_type_name} )
                                                              `}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                    </React.Fragment>
                                                  );
                                                }
                                              )}
                                          </ul>
                                        </td>
                                        <td className="text-center">
                                          {role.is_editable === 1 && (
                                            <button className="btn btn-info">
                                              <FeatherIcon
                                                icon="edit-2"
                                                fill="white"
                                                size={18}
                                                onClick={() =>
                                                  editRoleTe(role?.roles_id)
                                                }
                                              />
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}

                                {rolelist.length === 0 ? (
                                  <tr>
                                    <td colSpan={6} className="text-center">
                                      {Trans(
                                        "NOT_FOUND_CHOOSE_BANNER_GROUP",
                                        language
                                      )}
                                    </td>
                                  </tr>
                                ) : null}
                              </tbody>
                            </table>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              </div>
            </CheckPermission>
          </div>
          <Modal show={editShow} onHide={edithandleModalClose} size={"lg"}>
            <Modal.Header>
              <Modal.Title>{Trans("EDIT_ROLE", language)}</Modal.Title>
              <Button variant="danger" onClick={edithandleModalClose}>
                X
              </Button>
            </Modal.Header>
            <Modal.Body>
              <Edit
                filterItem={filterItem}
                handleModalClose={edithandleModalClose}
                editId={EditRoleID}
              />
            </Modal.Body>
          </Modal>
        </div>

        {/* add modal */}
        <Modal show={show} onHide={handleModalClose} size={"lg"}>
          <Modal.Header>
            <Modal.Title>{Trans("CREATE_ROLE", language)}</Modal.Title>
            <Button variant="danger" onClick={handleModalClose}>
              X
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Create
              filterItem={filterItem}
              handleModalClose={handleModalClose}
              checkedPermission={[]}
            />
          </Modal.Body>
        </Modal>
        {/* end end modal */}
      </Content>
    </>
  );
}

export default Index;
