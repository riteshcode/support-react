import React, { useState } from "react";
import POST from "axios/post";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import ColorInfo from "./ColorInfo";
import ModuleEdit from "./ModuleEdit";
import SubModuleEdit from "./SubModuleEdit";
import { useSelector, useDispatch } from "react-redux";
import { updateModuleListState } from "redux/slice/loginSlice";
import { Trans } from "lang/index";
import { Modal, Button } from "react-bootstrap";
import { moduleChangeStatusUrl, moduleUpdateSortOrderUrl } from "config/index";
import { useEffect } from "react";

function TreeComponent({ dataList, filterItem }) {
  const dispatch = useDispatch();
  const { apiToken, language } = useSelector((state) => state.login);
  const AccessColor = ["#ff8d00", "#001737", "#7a00ff"];

  const [editId, SetEditId] = useState();
  const [addModuleShow, setAddModuleShow] = useState(false);
  const [addSubModuleShow, setSubAddModuleShow] = useState(false);

  const ModuleEditData = (edit_id, type) => {
    SetEditId(edit_id);
    if (type === "module") setAddModuleShow(true);
    else setSubAddModuleShow(true);
  };

  const RefreshList = () => {
    filterItem("refresh", "", "");
  };

  const StatusChnageFun = (edit_id, type) => {
    const editData = {
      api_token: apiToken,
      update_id: edit_id,
      type: type,
    };
    POST(moduleChangeStatusUrl, editData)
      .then((response) => {
        const { message, data } = response.data;
        // update side module and section
        dispatch(updateModuleListState(data));
        RefreshList();
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const QuickAccessChangeFun = (edit_id, type) => {
    const editData = {
      api_token: apiToken,
      update_id: edit_id,
      type: type,
      quick_access: "quick_access",
    };
    POST(moduleChangeStatusUrl, editData)
      .then((response) => {
        const { message, data } = response.data;
        // update side module and section
        dispatch(updateModuleListState(data));
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

  const [moduledataList, SetmoduledataList] = useState([]);
  useEffect(() => {
    let abortController = new AbortController();
    // console.log("dataList", dataList);
    SetmoduledataList(dataList);
    return () => abortController.abort();
  }, [dataList]);

  return (
    <>
      <ColorInfo />
      {moduledataList &&
        moduledataList.map((module, index) => {
          const {
            module_id,
            module_name,
            status,
            access_priviledge,
            sort_order,
          } = module;
          // console.log("module_name:", module_name, "- Sort order:", sort_order);
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
                      <span>
                        <FeatherIcon
                          icon="circle"
                          fill={AccessColor[access_priviledge]}
                          color={AccessColor[access_priviledge]}
                          size={20}
                        />
                      </span>
                      {"  "}
                      <span>{module_name}</span>{" "}
                      <span style={{ float: "right" }}>
                        <span>
                          <input
                            type="number"
                            style={{ width: 50 }}
                            defaultValue={sort_order}
                            onBlur={(e) => {
                              SortOrderUpdate(e, module_id, "module");
                            }}
                          />
                        </span>
                        {"  "}
                        <span title="Edit">
                          <FeatherIcon
                            icon="edit"
                            onClick={() => {
                              ModuleEditData(module_id, "module");
                            }}
                            size={20}
                          />
                          {"  "}

                          <FeatherIcon
                            icon={status === 0 ? "toggle-left" : "toggle-right"}
                            onClick={() => {
                              StatusChnageFun(module_id, "module");
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
                            {module.section_list &&
                              module.section_list.map((section, secIdx) => {
                                const {
                                  section_name,
                                  quick_access,
                                  section_id,
                                  section_completion_status,
                                  status,
                                  sort_order,
                                } = section;
                                return (
                                  <li key={secIdx} className="mt-2">
                                    <b>{section_name}</b>
                                    {"  "}
                                    <span style={{ float: "right" }}>
                                      <span>
                                        <input
                                          type="number"
                                          style={{ width: 50 }}
                                          defaultValue={sort_order}
                                          onBlur={(e) => {
                                            SortOrderUpdate(
                                              e,
                                              section_id,
                                              "section"
                                            );
                                          }}
                                        />
                                      </span>{" "}
                                      <span className="ml-2">
                                        <FeatherIcon
                                          icon="edit"
                                          onClick={() => {
                                            ModuleEditData(
                                              section_id,
                                              "section"
                                            );
                                          }}
                                          size={15}
                                        />

                                        {"  "}
                                        <FeatherIcon
                                          icon={
                                            status === 0
                                              ? "toggle-left"
                                              : "toggle-right"
                                          }
                                          title="Quick Access"
                                          onClick={() => {
                                            StatusChnageFun(
                                              section_id,
                                              "section"
                                            );
                                          }}
                                          color={status === 0 ? "red" : "green"}
                                          size={15}
                                        />
                                        {"  "}
                                        <FeatherIcon
                                          icon={
                                            quick_access === 0
                                              ? "eye-off"
                                              : "eye"
                                          }
                                          title="Quick Access"
                                          onClick={() => {
                                            QuickAccessChangeFun(
                                              section_id,
                                              "section"
                                            );
                                          }}
                                          color={
                                            quick_access === 0 ? "red" : "green"
                                          }
                                          size={15}
                                        />
                                      </span>
                                    </span>
                                    {section.sub_section && (
                                      <ul>
                                        {section.sub_section.map(
                                          (subsection, idxx) => {
                                            const {
                                              section_id,
                                              section_name,
                                              quick_access,
                                              section_completion_status,
                                              status,
                                              sort_order,
                                            } = subsection;
                                            return (
                                              <li key={idxx} className="mt-2">
                                                <span>{section_name}</span>
                                                {"  "}
                                                <span
                                                  style={{ float: "right" }}
                                                >
                                                  <span>
                                                    <input
                                                      type="number"
                                                      style={{ width: 50 }}
                                                      defaultValue={sort_order}
                                                      onBlur={(e) => {
                                                        SortOrderUpdate(
                                                          e,
                                                          section_id,
                                                          "section"
                                                        );
                                                      }}
                                                    />
                                                  </span>
                                                  {"  "}
                                                  <span className="ml-2">
                                                    <FeatherIcon
                                                      icon="edit"
                                                      onClick={() => {
                                                        ModuleEditData(
                                                          section_id,
                                                          "section"
                                                        );
                                                      }}
                                                      size={15}
                                                    />

                                                    {"  "}
                                                    <FeatherIcon
                                                      icon={
                                                        status === 0
                                                          ? "toggle-left"
                                                          : "toggle-right"
                                                      }
                                                      title="Quick Access"
                                                      onClick={() => {
                                                        StatusChnageFun(
                                                          section_id,
                                                          "section"
                                                        );
                                                      }}
                                                      color={
                                                        status === 0
                                                          ? "red"
                                                          : "green"
                                                      }
                                                      size={15}
                                                    />
                                                    {"  "}
                                                    <FeatherIcon
                                                      icon={
                                                        quick_access === 0
                                                          ? "eye-off"
                                                          : "eye"
                                                      }
                                                      title="Quick Access"
                                                      onClick={() => {
                                                        QuickAccessChangeFun(
                                                          section_id,
                                                          "section"
                                                        );
                                                      }}
                                                      color={
                                                        quick_access === 0
                                                          ? "red"
                                                          : "green"
                                                      }
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
                              })}
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
          <Modal.Title>{Trans("EDIT_MODULE", language)}</Modal.Title>
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
          <ModuleEdit
            editId={editId}
            RefreshList={RefreshList}
            handleModalClose={() => {
              setAddModuleShow(false);
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
          <Modal.Title>{Trans("EDIT_SECTION", language)}</Modal.Title>
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
          <SubModuleEdit
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
