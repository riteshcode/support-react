import React from "react";
import CheckPermission from "helper";
import FeatherIcon from "feather-icons-react";
import {
  BadgeShow,
  Col,
  IconButton,
  Anchor,
} from "component/UIElement/UIElement";
import { Trans } from "lang/index";
import { useSelector } from "react-redux";
import ModalAlert from "component/ModalAlert";
import { useState } from "react";
import { PreUpdate, PreRemove, PreView } from "config/PermissionName";
import WebsiteLink from "config/WebsiteLink";
import CategoryTable from "./CategoryTable";
function Table({
  showColumn,
  dataList,
  deleteFun,
  pageName,
  sortBy,
  orderBy,
  filterItem,
  editFun,
  updateStatusFunction,
  updateIsfeatureFunction,
  mainKey,
}) {
  const { apiToken, language } = useSelector((state) => state.login);
  const [showModalAlert, SetshowModalAlert] = useState(false);

  const closeModal = () => {
    SetshowModalAlert(false);
  };

  const [ModalObject, SetModalObject] = useState({
    status: false,
    msg: "",
    functionName: "",
    param: "",
  });

  // delete function
  const deleteItem = (deleteId) => {
    SetshowModalAlert(true);
    SetModalObject({
      msg: "Are you sure !",
      functionName: deleteFun,
      param: deleteId,
      closeModal: closeModal,
    });
  };
  // change Status function
  const ChangeStatus = (deleteId) => {
    SetshowModalAlert(true);
    SetModalObject({
      msg: "Are you sure want to change status !",
      functionName: updateStatusFunction,
      param: deleteId,
      closeModal: closeModal,
    });
  };

  // change IsFeature function
  const ChangeIsFeature = (deleteId) => {
    SetshowModalAlert(true);
    SetModalObject({
      msg: "Are you sure want to change Is Feature !",
      functionName: updateIsfeatureFunction,
      param: deleteId,
      closeModal: closeModal,
    });
  };

  const editFunction = (editId) => {
    editFun(editId);
  };
  // filter order by id,email etc...
  const searchItem = (value, ord) => {
    filterItem("sortby", value, ord);
  };

  const [showType, SetShowType] = useState("");

  return (
    <>
      <Col col={12}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>{Trans("SL_NO", language)}</th>
                <th>{Trans("CATEGORY_IMAGE", language)}</th>
                <th>{Trans("CATEGORY_NAME", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th>{Trans("ISFEATURE", language)}</th>
                <th>{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat) => {
                  const {
                    categories_id,
                    categories_image,
                    category_name,
                    status,
                    is_featured,
                    categories_slug,
                  } = cat;
                  return (
                    <React.Fragment key={categories_id}>
                      <tr>
                        <td>
                          <IconButton
                            color="primary"
                            onClick={() => SetShowType(categories_slug)}
                          >
                            <FeatherIcon
                              icon="plus"
                              // fill="white"
                              onClick={() => SetShowType(categories_slug)}
                            />
                          </IconButton>
                        </td>
                        <td>{categories_id}</td>
                        <td>
                          <img
                            src={categories_image}
                            alt={categories_image}
                            height="30"
                          />
                        </td>
                        <td>{category_name}</td>
                        <td>
                          <BadgeShow type={status} content={status} />
                        </td>
                        <td>
                        <BadgeShow
                            type={is_featured === 1 ? "active" : "deactive"}
                            content={
                              is_featured === 1 ? "ACTIVE" : "DEACTIVE"
                            }/>
                        </td>
                        <td>
                          {" "}
                          <CheckPermission
                            PageAccess={pageName}
                            PageAction={PreUpdate}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => editFunction(categories_id)}
                            >
                              <FeatherIcon
                                icon="edit-2"
                                fill="white"
                                onClick={() => editFunction(categories_id)}
                              />
                            </IconButton>{" "}
                          </CheckPermission>
                          {"  "}
                          <IconButton
                            color="primary"
                            onClick={() => ChangeStatus(categories_id)}
                          >
                            <FeatherIcon
                              icon="repeat"
                              fill="white"
                              onClick={() => ChangeStatus(categories_id)}
                            />
                          </IconButton>
                          {"  "}
                          <IconButton
                            color="primary"
                            onClick={() => ChangeIsFeature(categories_id)}
                          >
                            <FeatherIcon
                              icon="feather"
                              fill="white"
                              onClick={() => ChangeIsFeature(categories_id)}
                            />
                          </IconButton>
                        </td>
                      </tr>
                      {categories_slug == showType && (
                        <>
                          {cat.sub_category.length > 0 && (
                            <tr>
                              <td colSpan={6}>
                                <CategoryTable
                                  showColumn={showColumn}
                                  dataList={cat.sub_category}
                                  pageName={pageName} // for checkpermission
                                  filterItem={filterItem}
                                  editFun={editFun}
                                  deleteFun={deleteItem}
                                  updateStatusFunction={updateStatusFunction}
                                  updateIsfeatureFunction={updateIsfeatureFunction}
                                  mainKey="categories_id"
                                />
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Col>
      {showModalAlert && <ModalAlert ModalObject={ModalObject} />}
    </>
  );
}

export default Table;
