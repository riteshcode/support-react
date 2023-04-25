import React from "react";
import CheckPermission from "helper";
import FeatherIcon from "feather-icons-react";
import { Badge, IconButton, Anchor } from "component/UIElement/UIElement";
import { useSelector } from "react-redux";

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
}) {
  const { role } = useSelector((state) => state.login);

  // delete function
  const deleteItem = (deleteId) => {
    let res = window.confirm("Are you sure !");
    if (res) deleteFun(deleteId);
  };
  // change Status function
  const ChangeStatus = (deleteId) => {
    let res = window.confirm("Are you sure want to change status !");
    if (res) updateStatusFunction(deleteId);
  };
  const RowChangeStatus = (deleteId, status) => {
    let res = window.confirm("Are you sure !");
    if (res) updateStatusFunction(deleteId, status);
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
        case "action":
          const actionButton = [];
          column.action_list.forEach(function (tditem, keyC) {
            if (tditem === "edit") {
              actionButton.push(
                <CheckPermission IsPageAccess={`${pageName}-manage`} key={keyC}>
                  <Anchor
                    path={`edit/${row[showColumn[0].field]}`}
                    className="btn btn-primary btn-xs btn-icon"
                  >
                    <FeatherIcon icon="edit-2" fill="white" />
                  </Anchor>
                </CheckPermission>
              );
            } else if (tditem === "view") {
              actionButton.push(
                <CheckPermission IsPageAccess={`${pageName}.view`} key={keyC}>
                  <Anchor
                    path={`view/${row[showColumn[0].field]}`}
                    className="btn btn-primary btn-xs btn-icon"
                  >
                    <FeatherIcon icon="eye" fill="white" />
                  </Anchor>
                </CheckPermission>
              );
            } else if (tditem === "delete") {
              actionButton.push(
                <CheckPermission IsPageAccess={`${pageName}-delete`} key={keyC}>
                  <IconButton
                    color="danger"
                    onClick={() => deleteItem(row[showColumn[0].field])}
                  >
                    <FeatherIcon
                      icon="trash-2"
                      fill="red"
                      onClick={() => deleteItem(row[showColumn[0].field])}
                    />
                  </IconButton>
                </CheckPermission>
              );
            } else if (tditem === "edit_fun") {
              actionButton.push(
                <CheckPermission IsPageAccess={`${pageName}-manage`} key={keyC}>
                  <IconButton
                    color="primary"
                    onClick={() => editFunction(row[showColumn[0].field])}
                  >
                    <FeatherIcon
                      icon="edit-2"
                      fill="white"
                      onClick={() => editFunction(row[showColumn[0].field])}
                    />
                  </IconButton>
                </CheckPermission>
              );
            } else if (tditem === "changeStatus") {
              actionButton.push(
                <IconButton
                  color="primary"
                  onClick={() => ChangeStatus(row[showColumn[0].field])}
                >
                  <FeatherIcon
                    icon="repeat"
                    fill="white"
                    onClick={() => ChangeStatus(row[showColumn[0].field])}
                  />
                </IconButton>
              );
            }
          });
          tdList.push(<td key={key}>{actionButton}</td>);
          break;
        case "status":
          if (row[column.field] === "Pending") {
            if (role === "admin" || role === "superadmin")
              tdList.push(
                <td key={key}>
                  <button
                    className="btn btn-info"
                    onClick={() =>
                      RowChangeStatus(row[showColumn[0].field], "1")
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      RowChangeStatus(row[showColumn[0].field], "2")
                    }
                  >
                    Reject
                  </button>
                </td>
              );
            else
              tdList.push(
                <td key={key}>
                  <Badge color="success">{row[column.field]}</Badge>
                </td>
              );
          } else tdList.push(<td key={key}>{row[column.field] === "Approved" ? <Badge color="success">{row[column.field]}</Badge> : <Badge color="danger">{row[column.field]}</Badge>}</td>);
          break;
        default:
          if ("linkTo" in column && "linkId" in column) {
            const linkUrl = column.linkTo;
            tdList.push(
              <td key={key}>
                <Anchor path={linkUrl.replace(":id", row[column.linkId])}>
                  {row[column.field]}
                </Anchor>
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
      <table className="table">
        <thead>
          <tr>{thead}</tr>
        </thead>
        <tbody>{tbody}</tbody>
      </table>
    </>
  );
}

export default Table;
