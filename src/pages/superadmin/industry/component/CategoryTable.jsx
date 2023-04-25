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

                <th>{Trans("INDUSTRY_CATEGORY_NAME", language)}</th>
                <th>{Trans("DEMO_DB", language)}</th>
                <th>{Trans("DEMO_URL", language)}</th>

                <th>{Trans("STATUS", language)}</th>
                <th className="text-center">{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, IDX) => {
                  const {
                    industry_category_id,
                    demo_db,

                    demo_url,
                    industry_details,
                    industry_category_name,
                    status,
                    categories_slug,
                  } = cat;
                  console.log(cat.industry_category_id);
                  return (
                    <React.Fragment key={IDX}>
                      <tr>
                        <td>{IDX + 1}</td>

                        <td>{industry_category_name}</td>
                        <td>{demo_db}</td>
                        <td>{demo_url}</td>

                        <td>
                          <BadgeShow
                            type={status === 1 ? "success" : "danger"}
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
                              onClick={() => editFunction(industry_category_id)}
                            >
                              <FeatherIcon
                                icon="edit-2"
                                fill="white"
                                size={20}
                                onClick={() =>
                                  editFunction(industry_category_id)
                                }
                              />
                            </IconButton>{" "}
                          </CheckPermission>
                          {"  "}
                          <IconButton
                            color="primary"
                            onClick={() => ChangeStatus(industry_category_id)}
                          >
                            <FeatherIcon
                              icon="repeat"
                              fill="white"
                              onClick={() => ChangeStatus(industry_category_id)}
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
