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
import { SettingGroup } from "config/WebsiteUrl";

function Table({
  dataList,
  deleteFun,
  pageName,
  filterItem,
  editFun,
  viewFunction,
  updateStatusFunction,
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

  return (
    <>
      <Col col={12}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{Trans("SL_NO", language)}</th>
                <th>{Trans("INDUSTRY_NAME", language)}</th>
                <th>{Trans("SORT_ORDER", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th className="text-center">{Trans("ACTION", language)}</th>
                <th>{Trans("MODULE_LIST", language)}</th>
                <th>{Trans("WEB_FUNCTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, IDX) => {
                  const {
                    industry_id,
                    industry_name,
                    module_list,
                    status,
                    sort_order,
                    function_list,
                    categories_slug,
                  } = cat;
                  return (
                    <React.Fragment key={IDX}>
                      <tr>
                        <td>{IDX + 1}</td>

                        <td>{industry_name}</td>
                        <td>{sort_order}</td>
                        <td>
                          <BadgeShow
                            type={status === 1 ? "success" : "danger"}
                            content={status === 1 ? "Active" : "Deactive"}
                          />
                        </td>
                        <td className="text-center">
                          <Anchor
                            color="primary"
                            path={WebsiteLink(`/industry/view/${industry_id}`)}
                          >
                            <button className="btn btn-primary">
                              <FeatherIcon icon="eye" color="white" />
                            </button>
                          </Anchor>{" "}
                          <CheckPermission
                            PageAccess={pageName}
                            PageAction={PreUpdate}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => editFunction(industry_id)}
                            >
                              <FeatherIcon
                                icon="edit-2"
                                fill="white"
                                size={20}
                                onClick={() => editFunction(industry_id)}
                              />
                            </IconButton>{" "}
                          </CheckPermission>
                          {"  "}
                          <IconButton
                            color="primary"
                            onClick={() => ChangeStatus(industry_id)}
                          >
                            <FeatherIcon
                              icon="repeat"
                              fill="white"
                              onClick={() => ChangeStatus(industry_id)}
                            />
                          </IconButton>{" "}
                          <IconButton
                            color="danger"
                            onClick={() => deleteItem(industry_id)}
                          >
                            <FeatherIcon
                              icon="x-square"
                              fill="red"
                              onClick={() => deleteItem(industry_id)}
                            />
                          </IconButton>
                        </td>
                        <td>{module_list}</td>
                        <td>{function_list}</td>
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
