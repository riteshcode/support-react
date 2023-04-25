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
import { FeaturedProduct } from "config/WebsiteUrl";

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
                <th>{Trans("COMPONENT_NAME", language)}</th>
                <th>{Trans("COMPONENT_KEY", language)}</th>
                <th>{Trans("PARENT_COMPONENT", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th className="text-center">{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, IDX) => {
                  const {
                    component_id,
                    component_name,
                    component_key,
                    parent_id,
                    status,
                  } = cat;
                  return (
                    <React.Fragment key={IDX}>
                      <tr>
                        <td>{IDX + 1}</td>

                        <td>{component_name}</td>
                        <td>{component_key}</td>
                        <td>{parent_id}</td>
                        <td>
                          <BadgeShow
                            type={status === 1 ? "success" : "deactive"}
                            content={status === 1 ? "Active" : "Deactive"}
                          />
                        </td>
                        <td className="text-center">
                          {" "}
                          <CheckPermission
                            PageAccess={pageName}
                            PageAction={PreUpdate}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => editFunction(component_id)}
                            >
                              <FeatherIcon
                                icon="edit-2"
                                fill="white"
                                size={20}
                                onClick={() => editFunction(component_id)}
                              />
                            </IconButton>{" "}
                          </CheckPermission>
                          {"  "}
                          <IconButton
                            color="primary"
                            onClick={() => ChangeStatus(component_id)}
                          >
                            <FeatherIcon
                              icon="repeat"
                              fill="white"
                              onClick={() => ChangeStatus(component_id)}
                            />
                          </IconButton>{" "}
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
