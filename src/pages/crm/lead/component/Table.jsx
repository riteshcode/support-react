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
  viewFunction,
  updateStatusFunction,
  mainKey,
  leadStatus,
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

  const viewFun = (editId) => {
    viewFunction(editId);
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
                <th>{Trans("COMPANY_NAME", language)}</th>
                <th>{Trans("COMPANY_PHONE", language)}</th>
                <th>{Trans("PRIORITY", language)}</th>
                <th>{Trans("FOLLOW_UP", language)}</th>
                <th>{Trans("FOLLOW_DATE", language)}</th>
                <th>{Trans("FOLLOW_UP_STATUS", language)}</th>
                <th>{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, idx) => {
                  const {
                    lead_id,
                    company_name,
                    phone,
                    folllow_up,
                    folloup_date,
                    status,
                    followup_id,
                    priority,
                  } = cat;
                  idx++;
                  return (
                    <React.Fragment key={idx}>
                      <tr>
                        <td>{idx}</td>
                        <td>{company_name}</td>
                        <td>{phone}</td>
                        <td>{priority}</td>
                        <td>{folllow_up}</td>
                        <td>{folloup_date}</td>
                        <td>
                          <select
                            className={`badge badge-${statusColor[status]}`}
                            value={status}
                            onChange={(e) => {
                              StatusChange(lead_id, e.target.value);
                            }}
                          >
                            {leadStatus &&
                              leadStatus.map((curr) => (
                                <option
                                  value={curr.status_id}
                                  key={curr.status_id}
                                >
                                  {curr.status_name}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td>
                          {" "}
                          <CheckPermission
                            PageAccess={pageName}
                            PageAction={PreUpdate}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => editFunction(lead_id)}
                            >
                              <FeatherIcon
                                icon="edit-2"
                                fill="white"
                                size={20}
                                onClick={() => editFunction(lead_id)}
                              />
                            </IconButton>{" "}
                          </CheckPermission>
                          {"  "}
                          <CheckPermission
                            PageAccess={pageName}
                            PageAction={PreUpdate}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => viewFun(lead_id)}
                            >
                              <FeatherIcon
                                icon="eye"
                                size={20}
                                onClick={() => viewFun(lead_id)}
                              />
                            </IconButton>{" "}
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
