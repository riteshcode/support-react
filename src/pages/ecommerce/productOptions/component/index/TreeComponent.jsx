import React, { useState } from "react";
import POST from "axios/post";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import EditOptionValue from "./EditOptionValue";
import EditOption from "./EditOption";
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
    if (type === "module") setFieldGroupModuleShow(true);
    else if (type === "fieldGroup") setAddModuleShow(true);
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
        editData.products_options_id = edit_id;
        ajaxurl = paymentTypeChangeStatusUrl;
        break;
      case "fieldGroup":
        editData.products_options_values_id = edit_id;
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
          const { products_options_id, products_options_name, status } =
            productType;
          // console.log("products_options_name:", products_options_name, "- Sort order:", sort_order);
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
                      <span>{Trans(products_options_name, language)}</span>{" "}
                      <span style={{ float: "right" }}>
                        {"  "}
                        <span title="Edit">
                          <FeatherIcon
                            icon="edit"
                            onClick={() => {
                              ModuleEditData(products_options_id, "module");
                            }}
                            size={20}
                          />
                          {"  "}
                        </span>
                      </span>
                    </h6>
                    <div className={bodyClass}>
                      <div className="row">
                        <div className="col-md-12">
                          <ul>
                            {productType.products_options_values &&
                              productType.products_options_values.map(
                                (fieldGroup, secIdx) => {
                                  const {
                                    products_options_values_name,
                                    products_options_values_id,
                                    status,
                                  } = fieldGroup;
                                  return (
                                    <li key={secIdx} className="mt-2">
                                      <b>
                                        {Trans(
                                          products_options_values_name,
                                          language
                                        )}
                                      </b>
                                      {"  "}
                                      <span style={{ float: "right" }}>
                                        <span className="ml-2">
                                          <FeatherIcon
                                            icon="edit"
                                            onClick={() => {
                                              ModuleEditData(
                                                products_options_values_id,
                                                "fieldGroup"
                                              );
                                            }}
                                            size={18}
                                          />
                                          {"  "}
                                        </span>
                                      </span>
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
          <Modal.Title>
            {Trans("EDIT_PRODUCT_OPTION_VALUE", language)}
          </Modal.Title>
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
          <EditOptionValue
            editId={editId}
            RefreshList={RefreshList}
            optionList={dataList}
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
          <Modal.Title>{Trans("EDIT_PRODUCT_OPTION", language)}</Modal.Title>
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
          <EditOption
            editId={editId}
            RefreshList={RefreshList}
            handleModalClose={() => {
              setFieldGroupModuleShow(false);
            }}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </>
  );
}

export default TreeComponent;
