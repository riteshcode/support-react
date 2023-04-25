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

  return (
    <>
      <Col col={12}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
      
                <th>{Trans("FUNCTION_NAME", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th>{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, IDX) => {
                  const {
                    function_id,
                    function_name,
                    status,
                    categories_slug,
                  } = cat;
                  const statusName = cat?.settings_details?.status; 
                  return (
                    <React.Fragment key={IDX}>
                      <tr>
                        <td>{function_name}</td>
                        <td>
                          <BadgeShow type={statusName === 'enabled' ? 'active':'deactive'} content={statusName} />
                        </td>
                        <td>
                        
                          <IconButton
                            color="primary"
                            onClick={() => ChangeStatus(function_id)}
                          >
                            <FeatherIcon
                              icon="repeat"
                              fill="white"
                              onClick={() => ChangeStatus(function_id)}
                            />
                          </IconButton>
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
