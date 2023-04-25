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

  const editFunction = (editId) => {
    editFun(editId);
  };
  // filter order by id,email etc...
  const searchItem = (value, ord) => {
    filterItem("sortby", value, ord);
  };

  const [showType, SetShowType] = useState("");
  const stSarr = ["Draft", "Active", "Inactive"];
  const stSarrC = ["warning", "success", "danger"];
  const StatusChange = (quoteId, statusId) => {
    updateStatusFunction(quoteId, statusId);
  };
  return (
    <>
      <Col col={12}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{Trans("SL_NO", language)}</th>
                <th>{Trans("PRODUCT_IMAGE", language)}</th>
                <th>{Trans("PRODUCT_NAME", language)}</th>
                <th>{Trans("PRODUCT_MODEL", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th>{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, idx) => {
                  const {
                    product_id,
                    product_image,
                    product_model,
                    products_name,
                    product_status,
                    product_slug,
                  } = cat;
                  idx++;
                  return (
                    <React.Fragment key={product_id}>
                      <tr>
                        <td>{idx}</td>
                        <td>
                          <img src={product_image} height="30" />
                        </td>
                        <td>{products_name}</td>
                        <td>{product_model}</td>

                        <td>
                          <select
                            value={product_status}
                            onChange={(e) => {
                              StatusChange(product_id, e.target.value);
                            }}
                            className={`badge badge-${stSarrC[product_status]}`}
                          >
                            <option value={0}>
                              {Trans("Draft", language)}
                            </option>
                            <option value={1}>
                              {Trans("Active", language)}
                            </option>
                            <option value={2}>
                              {Trans("Inactive", language)}
                            </option>
                          </select>
                        </td>
                        <td>
                          {" "}
                          <Anchor
                            path={WebsiteLink(`/products/show/${product_id}`)}
                            className="btn btn-warning btn-xs btn-icon"
                          >
                            <FeatherIcon icon="eye" />
                          </Anchor>
                          {"  "}
                          <CheckPermission
                            PageAccess={pageName}
                            PageAction={PreUpdate}
                          >
                            <Anchor
                              path={WebsiteLink("/products/edit/" + product_id)}
                              className="btn btn-primary pd-2"
                            >
                              <FeatherIcon icon="edit-2" fill="white" />
                            </Anchor>{" "}
                          </CheckPermission>
                        </td>
                      </tr>
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
