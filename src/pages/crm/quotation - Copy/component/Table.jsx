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
import Moment from "react-moment";

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

  const statusColor = ["danger", "warning", "info", "success", "danger"];

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
                <th>{Trans("DATE", language)}</th>
                <th>{Trans("QUOTATION_NO", language)}</th>
                <th>{Trans("COMPANY_NAME", language)}</th>
                <th>{Trans("FINAL_COST", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th>{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, idx) => {
                  const {
                    quotation_id,
                    quotation_no,
                    final_cost,
                    currency,
                    created_at,
                    status,
                    crm_quotation_customer,
                  } = cat;
                  idx++;
                  return (
                    <React.Fragment key={quotation_id}>
                      <tr>
                        <td>{idx}</td>
                        <td>
                          <Moment format="Do MMMM YYYY">{created_at}</Moment>
                        </td>
                        <td>{quotation_no}</td>
                        <td>{crm_quotation_customer?.company_name}</td>
                        <td>
                          {currency} {final_cost.toFixed(2)}
                        </td>
                        <td>
                          <select
                            className={`badge badge-${statusColor[status]}`}
                            defaultValue={status}
                            onChange={(e) => {
                              StatusChange(quotation_id, e.target.value);
                            }}
                          >
                            <option value={0}>
                              {Trans("Removed", language)}
                            </option>
                            <option value={1}>
                              {Trans("DELETED", language)}
                            </option>
                            <option value={2}>
                              {Trans("Delivered", language)}
                            </option>
                            <option value={3}>
                              {Trans("Accepted", language)}
                            </option>
                            <option value={4}>
                              {Trans("Declined", language)}
                            </option>
                          </select>
                        </td>
                        <td>
                          {" "}
                          <Anchor
                            path={WebsiteLink(
                              `/quotation/show/${quotation_id}`
                            )}
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
                              path={WebsiteLink(
                                "/quotation/edit/" + quotation_id
                              )}
                              className="btn btn-primary btn-xs btn-icon"
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
