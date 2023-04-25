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
import { PreUpdate } from "config/PermissionName";
import WebsiteLink from "config/WebsiteLink";
import { useEffect } from "react";

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

  useEffect(() => {
    console.log(dataList);
  }, []);

  return (
    <React.Fragment>
      <Col col={12}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{Trans("SL_NO", language)}</th>
                <th>{Trans("CATEGORY_IMAGE", language)}</th>
                <th>{Trans("CATEGORY_NAME", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th>{Trans("IS_FEATURED", language)}</th>
                <CheckPermission PageAccess={pageName} PageAction={PreUpdate}>
                  <th>{Trans("ACTION", language)}</th>
                </CheckPermission>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, idx) => {
                  const {
                    categories_id,
                    categories_image,
                    category_name,
                    status,
                    is_featured,
                  } = cat;
                  return (
                    <React.Fragment key={idx}>
                      <tr>
                        <td>{idx + 1}</td>
                        <td>
                          <img
                            src={categories_image}
                            alt={categories_image}
                            height="30"
                          />
                        </td>
                        <td>
                          {" "}
                          <Anchor
                            path={WebsiteLink(`/products?c=${categories_id}`)}
                            className="primary"
                          >
                            {category_name}
                          </Anchor>
                        </td>
                        <td>
                          <BadgeShow type={status} content={status} />
                        </td>
                        <td>
                          <BadgeShow
                            type={is_featured === 1 ? "active" : "deactive"}
                            content={is_featured === 1 ? "ACTIVE" : "DEACTIVE"}
                          />
                        </td>
                        <td>
                          <CheckPermission
                            PageAccess={pageName}
                            PageAction={PreUpdate}
                          >
                            <Anchor
                              path={WebsiteLink(`/categories/${categories_id}`)}
                              className="btn btn-warning btn-xs btn-icon"
                            >
                              <FeatherIcon icon="eye" />
                            </Anchor>
                            {"  "}
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
                          </CheckPermission>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              {dataList.length == 0 && (
                <React.Fragment>
                  <tr>
                    <td colSpan="5" className="text-center">
                      {Trans("NO_ROCORDS", language)}
                    </td>
                  </tr>
                </React.Fragment>
              )}
            </tbody>
          </table>
        </div>
      </Col>
      {showModalAlert && <ModalAlert ModalObject={ModalObject} />}
    </React.Fragment>
  );
}

export default Table;
