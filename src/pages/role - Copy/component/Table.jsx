import React from "react";
import CheckPermission from "helper";
import FeatherIcon from "feather-icons-react";
import {
  BadgeShow,
  Col,
  IconButton,
  Anchor,
} from "component/UIElement/UIElement";
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

  // show table heading column
  const thead = [];
  // thead.push(<th scope="col">SL_NO</th>);

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
  }
  dataList.forEach(function (row, idx) {
    const tdList = [];
    showColumn.forEach(function (column, key) {
      /* why switch: bcoz don't want to use nested if it will mess our code. In some case we need to create dynamic html( action, edit, button etc)  */
      switch (column.field) {
        case "sl_no":
          tdList.push(<td key={key}>{idx + 1}</td>);
          break;

        case "action":
          const actionButton = [];
          column.action_list.forEach(function (tditem, keyC) {
            if (tditem === "edit") {
              actionButton.push(
                <CheckPermission
                  PageAccess={pageName}
                  PageAction={PreUpdate}
                  key={keyC}
                >
                  <Anchor
                    path={`edit/${row[mainKey]}`}
                    className="btn btn-primary btn-xs btn-icon"
                  >
                    <FeatherIcon icon="edit-2" fill="white" />
                  </Anchor>
                </CheckPermission>
              );
            } else if (tditem === "view") {
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
            } else if (tditem === "delete") {
              actionButton.push(
                <CheckPermission
                  PageAccess={pageName}
                  PageAction={PreRemove}
                  key={keyC}
                >
                  <IconButton
                    key={keyC}
                    color="danger"
                    onClick={() => deleteItem(row[mainKey])}
                  >
                    <FeatherIcon
                      icon="trash-2"
                      fill="red"
                      onClick={() => deleteItem(row[mainKey])}
                    />
                  </IconButton>
                </CheckPermission>
              );
            } else if (tditem === "edit_fun") {
              actionButton.push(
                <CheckPermission
                  PageAccess={pageName}
                  PageAction={PreUpdate}
                  key={keyC}
                >
                  <IconButton
                    key={keyC}
                    color="primary"
                    onClick={() => editFunction(row[mainKey])}
                  >
                    <FeatherIcon
                      icon="edit-2"
                      fill="white"
                      onClick={() => editFunction(row[mainKey])}
                    />
                  </IconButton>{" "}
                </CheckPermission>
              );
            } else if (tditem === "changeStatus") {
              actionButton.push(
                <IconButton
                  key={keyC}
                  color="primary"
                  onClick={() => ChangeStatus(row[mainKey])}
                >
                  <FeatherIcon
                    icon="repeat"
                    fill="white"
                    onClick={() => ChangeStatus(row[mainKey])}
                  />
                </IconButton>
              );
            }
          });

          tdList.push(<td key={key}>{actionButton}</td>);
          break;
        case "status":
          tdList.push(
            <td key={key}>
              <BadgeShow type={row[column.field]} content={row[column.field]} />
              {/* {row[column.field].toLowerCase() === "active" ? (
                <Badge color="success">{row[column.field]}</Badge>
              ) : (
                <Badge color="danger">{row[column.field]}</Badge>
              )} */}
            </td>
          );
          break;
        default:
          if ("linkTo" in column && "linkId" in column) {
            const linkUrl = column.linkTo;
            tdList.push(
              <td key={key}>
                <Anchor
                  path={WebsiteLink(linkUrl.replace(":id", row[column.linkId]))}
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
                  height="30"
                />
              </td>
            );
          } else tdList.push(<td key={key}>{row[column.field]}</td>);

          break;
      }
    });

    tbody.push(<tr key={idx}>{tdList}</tr>);
  });

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
      {showModalAlert && <ModalAlert ModalObject={ModalObject} />}
    </>
  );
}

export default Table;
