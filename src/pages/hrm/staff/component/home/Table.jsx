import React from "react";
import { useSelector } from "react-redux";
import CheckPermission from "helper";
import FeatherIcon from "feather-icons-react";
import { Col, Anchor } from "component/UIElement/UIElement";
import { useState } from "react";
import { PreView } from "config/PermissionName";
import WebsiteLink from "config/WebsiteLink";
import TerminationModal from "./TerminationModal";
import POST from "axios/post";
import { staffChangeStatusUrl } from "config";
import Notify from "component/Notify";
import { Trans } from "lang";

function Table({
  showColumn,
  dataList,
  pageName,
  sortBy,
  orderBy,
  filterItem,
  mainKey,
}) {
  const { language, apiToken } = useSelector((state) => state.login);

  const [showModalAlert, SetshowModalAlert] = useState(false);

  const closeModal = () => {
    SetshowModalAlert(false);
  };

  const [ModalObject, SetModalObject] = useState({
    status: false,
    msg: "",
    functionName: "",
    param: "",
    type: "",
    status: "",
  });

  // change Status function
  const ChangeStatus = (staff_id, type, status) => {
    if (type === "verification") {
      const formData = {};
      formData.api_token = apiToken;
      formData.staff_id = staff_id;
      formData.type = type;

      POST(staffChangeStatusUrl, formData)
        .then((response) => {
          const { message } = response.data;
          filterItem("refresh", "", "");
          Notify(true, Trans(message, language));
        })
        .catch((error) => {
          Notify(false, error.message);
        });
    } else {
      SetshowModalAlert(true);
      SetModalObject({
        msg: "Are you sure want to change status !",
        param: staff_id,
        type: type,
        status: status,
        functionName: filterItem,
        closeModal: closeModal,
      });
    }
  };

  // filter order by id,email etc...
  const searchItem = (value, ord) => {
    filterItem("sortby", value, ord);
  };

  // show table heading column
  const thead = [];

  showColumn.forEach(function (column, ix) {
    let element = "";
    let orderS = "";
    if (column.sort) {
      let iconPush = [];
      if (column.field === sortBy) {
        iconPush.push(
          orderBy === "ASC" ? (
            <FeatherIcon icon="chevron-up" fill="red" key={ix} />
          ) : (
            <FeatherIcon icon="chevron-down" fill="#000" key={ix} />
          )
        );
        orderS = orderBy === "ASC" ? "DESC" : "ASC";
      } else {
        iconPush.push(<FeatherIcon icon="chevron-up" fill="red" key={ix} />);
        orderS = "ASC";
      }
      element = (
        <th
          scope="col"
          key={ix}
          onClick={() => searchItem(column.field, orderS)}
        >
          {column.label}
          {iconPush}
        </th>
      );
    } else {
      element = (
        <th scope="col" key={ix}>
          {column.label}
        </th>
      );
    }
    thead.push(element);
  });

  // create and show tbody ddata
  const tbody = [];
  if (dataList.length === 0) {
    tbody.push(
      <tr key={23}>
        <td className="text-center" colSpan={showColumn.length}>
          No record found !
        </td>
      </tr>
    );
  } else {
    dataList.forEach(function (row, idx) {
      const tdList = [];
      showColumn.forEach(function (column, key) {
        /* why switch: bcoz don't want to use nested if it will mess our code. In some case we need to create dynamic html( action, edit, button etc)  */
        switch (column.field) {
          case "sl_no":
            tdList.push(<td key={key}>{key + 1}</td>);
            break;
          case "action":
            const actionButton = [];
            column.action_list.forEach(function (tditem, keyC) {
              if (tditem === "view") {
                actionButton.push(
                  <CheckPermission
                    PageAccess={pageName}
                    PageAction={PreView}
                    key={keyC}
                  >
                    <Anchor
                      path={WebsiteLink(`view/${row[mainKey]}`)}
                      className="btn btn-primary btn-xs btn-icon"
                    >
                      <FeatherIcon icon="eye" />
                    </Anchor>
                  </CheckPermission>
                );
              }
            });
            tdList.push(<td key={key}>{actionButton}</td>);
            break;

          case "verification_status":
            tdList.push(
              <td key={key}>
                <select
                  className={`badge badge-${
                    row[column.field] === 1 ? "success" : "warning"
                  }`}
                  defaultValue={row[column.field]}
                  onChange={(e) =>
                    ChangeStatus(row[mainKey], "verification", e.target.value)
                  }
                >
                  <option value={0}>Pending</option>
                  <option value={1}>Verified</option>
                </select>
              </td>
            );
            break;

          case "status":
            tdList.push(
              <td key={key}>
                <FeatherIcon
                  icon={
                    row[column.field] === 2 ? "toggle-left" : "toggle-right"
                  }
                  color={row[column.field] === 2 ? "red" : "green"}
                  onClick={() =>
                    ChangeStatus(row[mainKey], "status", row[column.field])
                  }
                />
              </td>
            );
            break;
          default:
            if ("linkTo" in column && "linkId" in column) {
              const linkUrl = column.linkTo;
              tdList.push(
                <td key={key}>
                  <Anchor
                    path={WebsiteLink(
                      linkUrl.replace(":id", row[column.linkId])
                    )}
                  >
                    {row[column.field]}
                  </Anchor>
                </td>
              );
            } else if (column.field_type === "image") {
              tdList.push(
                <td key={key}>
                  <img
                    src={row[column.field]}
                    alt={row[column.field]}
                    height="50"
                  />
                </td>
              );
            } else tdList.push(<td key={key}>{row[column.field]}</td>);

            break;
        }
      });

      tbody.push(<tr key={idx}>{tdList}</tr>);
    });
  }
  return (
    <>
      <Col col={12}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>{thead}</tr>
            </thead>
            <tbody>{tbody}</tbody>
          </table>
        </div>
      </Col>
      {showModalAlert && <TerminationModal ModalObject={ModalObject} />}
    </>
  );
}

export default Table;
