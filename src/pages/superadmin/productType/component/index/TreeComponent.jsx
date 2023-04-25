import React, { useState } from "react";
import POST from "axios/post";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import EditProductType from "./editProductType";
import EditFields from "./editFields";
import EditFieldGroup from "./editFieldGroup";
import { useSelector, useDispatch } from "react-redux";
import { updateModuleListState } from "redux/slice/loginSlice";
import { Trans } from "lang/index";
import { Modal, Button } from "react-bootstrap";
import {
  paymentTypeChangeStatusUrl,
  moduleUpdateSortOrderUrl,
  fieldsgroupChangeStatusUrl,
} from "config/index";

function TreeComponent({ dataList, filterItem }) {
  const dispatch = useDispatch();
  const { apiToken, language } = useSelector((state) => state.login);
  const AccessColor = ["#ff8d00", "#001737", "#7a00ff"];

  const [editId, SetEditId] = useState();
  const [addModuleShow, setAddModuleShow] = useState(false);
  const [addSubModuleShow, setSubAddModuleShow] = useState(false);
  const [addFieldGroupModuleShow, setFieldGroupModuleShow] = useState(false);

  const ModuleEditData = (edit_id, type) => {
    SetEditId(edit_id);
    if (type === "module") setAddModuleShow(true);
    else if (type === "fieldGroup") setFieldGroupModuleShow(true);
    else setSubAddModuleShow(true);
  };

  const RefreshList = () => {
    filterItem("refresh", "", "");
  };

  const StatusChnageFun = (edit_id, type) => {
    const editData = { api_token: apiToken };
    let ajaxurl = "";

    switch (type) {
      case "module":
        editData.product_type_id = edit_id;
        ajaxurl = paymentTypeChangeStatusUrl;
        break;
      case "fieldGroup":
        editData.fieldsgroup_id = edit_id;
        ajaxurl = fieldsgroupChangeStatusUrl;
        break;
    }

    POST(ajaxurl, editData)
      .then((response) => {
        const { message, data } = response.data;
        RefreshList();
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const SortOrderUpdate = (e, edit_id, type) => {
    const editData = {
      api_token: apiToken,
      update_id: edit_id,
      sort_order: e.target.value,
      type: type,
    };
    POST(moduleUpdateSortOrderUrl, editData)
      .then((response) => {
        const { message, data } = response.data;

        // update side module and section
        dispatch(updateModuleListState(data));
        // RefreshList();
        // Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {dataList &&
        dataList.map((productType, index) => {
          const { product_type_id, product_type_name, status } = productType;
          // console.log("product_type_name:", product_type_name, "- Sort order:", sort_order);
          let headerClass =
            "accordion-title ui-accordion-header ui-corner-top ui-state-default ui-accordion-header-active ui-state-active ui-accordion-icons h6Module";
          let bodyClass =
            "accordion-body ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content h6bodyIn";

          return (
            <div className="col-md-12" key={index}>
              <div data-label="Style 2" className="df-example">
                <div
                  id="accordion4"
                  className="accordion accordion-style2 ui-accordion ui-widget ui-helper-reset "
                >
                  <div key={index} style={{ marginTop: 10, marginBottom: 10 }}>
                    <h6 className={headerClass}>
                      <span>{Trans(product_type_name, language)}</span>{" "}
                      <span style={{ float: "right" }}>
                        {"  "}
                        <span title="Edit">
                          <FeatherIcon
                            icon="edit"
                            onClick={() => {
                              ModuleEditData(product_type_id, "module");
                            }}
                            size={20}
                          />
                          {"  "}

                          <FeatherIcon
                            icon={status === 0 ? "toggle-left" : "toggle-right"}
                            onClick={() => {
                              StatusChnageFun(product_type_id, "module");
                            }}
                            color={status === 0 ? "red" : "green"}
                            size={20}
                          />
                        </span>
                      </span>
                    </h6>
                    <div className={bodyClass}>
                      <div className="row">
                        <div className="col-md-12">
                          <ul>
                            {productType.fields_group &&
                              productType.fields_group.map(
                                (fieldGroup, secIdx) => {
                                  const {
                                    fieldsgroup_name,
                                    fieldsgroup_id,
                                    status,
                                    sort_order,
                                  } = fieldGroup;
                                  return (
                                    <li key={secIdx} className="mt-2">
                                      <b>{Trans(fieldsgroup_name, language)}</b>
                                      {"  "}
                                      <span style={{ float: "right" }}>
                                        <span className="ml-2">
                                          <FeatherIcon
                                            icon="edit"
                                            onClick={() => {
                                              ModuleEditData(
                                                fieldsgroup_id,
                                                "fieldGroup"
                                              );
                                            }}
                                            size={18}
                                          />
                                          {"  "}
                                          <FeatherIcon
                                            icon={
                                              status === 0
                                                ? "toggle-left"
                                                : "toggle-right"
                                            }
                                            onClick={() => {
                                              StatusChnageFun(
                                                fieldsgroup_id,
                                                "fieldGroup"
                                              );
                                            }}
                                            color={
                                              status === 0 ? "red" : "green"
                                            }
                                            size={20}
                                          />
                                        </span>
                                      </span>
                                      {fieldGroup.fields && (
                                        <ul>
                                          {fieldGroup.fields.map(
                                            (fields, idxx) => {
                                              const {
                                                fields_id,
                                                fieldsgroup_id,
                                                field_name,
                                                quick_access,
                                                section_completion_status,
                                                status,
                                                sort_order,
                                              } = fields;
                                              return (
                                                <li key={idxx} className="mt-2">
                                                  <span>
                                                    {Trans(
                                                      field_name,
                                                      language
                                                    )}
                                                  </span>
                                                  {"  "}
                                                  <span
                                                    style={{ float: "right" }}
                                                  >
                                                    <span className="ml-2">
                                                      <FeatherIcon
                                                        icon="edit"
                                                        onClick={() => {
                                                          ModuleEditData(
                                                            fields_id,
                                                            "section"
                                                          );
                                                        }}
                                                        size={15}
                                                      />
                                                    </span>
                                                  </span>
                                                </li>
                                              );
                                            }
                                          )}
                                        </ul>
                                      )}
                                    </li>
                                  );
                                }
                              )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {/* Module Edit modal */}
      <Modal
        show={addModuleShow}
        onHide={() => {
          setAddModuleShow(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>{Trans("EDIT_PRODUCT_TYPE", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => {
              setAddModuleShow(false);
            }}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <EditProductType
            editId={editId}
            RefreshList={RefreshList}
            handleModalClose={() => {
              setAddModuleShow(false);
            }}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* Sub fileld Type Edit modal */}
      <Modal
        show={addFieldGroupModuleShow}
        onHide={() => {
          setFieldGroupModuleShow(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>{Trans("EDIT_FIELD_GROUP", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => {
              setFieldGroupModuleShow(false);
            }}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <EditFieldGroup
            editId={editId}
            RefreshList={RefreshList}
            handleModalClose={() => {
              setFieldGroupModuleShow(false);
            }}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}

      {/* Sub Module Edit modal */}
      <Modal
        show={addSubModuleShow}
        onHide={() => {
          setSubAddModuleShow(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>{Trans("EDIT_FIELD", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => {
              setSubAddModuleShow(false);
            }}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <EditFields
            editId={editId}
            RefreshList={RefreshList}
            handleModalClose={() => {
              setSubAddModuleShow(false);
            }}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </>
  );
}

export default TreeComponent;
