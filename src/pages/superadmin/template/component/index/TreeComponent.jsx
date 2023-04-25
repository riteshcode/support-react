import React, { useState } from "react";
import POST from "axios/post";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import ColorInfo from "./ColorInfo";
import EditTemplate from "./EditTemplate";
import EditSection from "./EditSection";
import EditSectionGroup from "./EditSectionGroup";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import { Modal, Button } from "react-bootstrap";
import {
  TemplateChangeStatusUrl,
  moduleUpdateSortOrderUrl,
} from "config/index";
import { useEffect } from "react";
import EditTemplateComponent from "./EditTemplateComponent";

function TreeComponent({ dataList, filterItem }) {
  const { apiToken, language } = useSelector((state) => state.login);
  const [editId, SetEditId] = useState();
  const [addModuleShow, setAddModuleShow] = useState(false);
  const [addSubModuleShow, setSubAddModuleShow] = useState(false);
  const [addSubGroupModuleShow, setSubAddGroupModuleShow] = useState(false);

  const [templateCompShow, setTemplateCompShow] = useState(false);

  const ModuleEditData = (edit_id, type) => {
    SetEditId(edit_id);
    if (type === "module") setAddModuleShow(true);
    else if (type === "sectionGroup") setSubAddGroupModuleShow(true);
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
    POST(TemplateChangeStatusUrl, editData)
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

        RefreshList();
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [templateDataList, SetTemplateDataList] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();
    // console.log("dataList", dataList);
    SetTemplateDataList(dataList);
    return () => abortController.abort();
  }, [dataList]);

  return (
    <React.Fragment>
      <ColorInfo />
      {templateDataList &&
        templateDataList.map((template, index) => {
          const { template_id, template_name, status, sort_order } = template;

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
                      <span>{template_name}</span>
                      <span style={{ float: "right" }}>
                        <span title="Edit">
                          <FeatherIcon
                            icon="grid"
                            onClick={() => {
                              setTemplateCompShow(true);
                              SetEditId(template_id);
                            }}
                            color="#080808"
                            size={20}
                          />
                          {"  "}
                          <FeatherIcon
                            icon="edit"
                            onClick={() => {
                              ModuleEditData(template_id, "module");
                            }}
                            size={20}
                          />
                          {"  "}

                          <FeatherIcon
                            icon={status === 0 ? "toggle-left" : "toggle-right"}
                            onClick={() => {
                              StatusChnageFun(template_id, "template");
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
                            {template.template_sections &&
                              template.template_sections.map(
                                (section, secIdx) => {
                                  const { section_name } = section;
                                  return (
                                    <li key={secIdx} className="mt-2">
                                      <b>{section_name}</b>
                                      {section.template_section_options && (
                                        <ul>
                                          {section.template_section_options.map(
                                            (subsection, idxx) => {
                                              const {
                                                section_option_id,
                                                section_option_name,
                                                status,
                                              } = subsection;
                                              return (
                                                <li key={idxx} className="mt-2">
                                                  <span>
                                                    {section_option_name}
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
                                                            section_option_id,
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
                                                            section_option_id,
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
          <Modal.Title>{Trans("EDIT_TEMPLATE", language)}</Modal.Title>
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
          <EditTemplate
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
          <EditSection
            editId={editId}
            RefreshList={RefreshList}
            handleModalClose={() => {
              setSubAddModuleShow(false);
            }}
          />
        </Modal.Body>
      </Modal>

      {/* end end modal */}
      <Modal
        show={addSubGroupModuleShow}
        onHide={() => {
          setSubAddGroupModuleShow(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>{Trans("EDIT_SECTION_GROUP", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => {
              setSubAddGroupModuleShow(false);
            }}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <EditSectionGroup
            editId={editId}
            RefreshList={RefreshList}
            handleModalClose={() => {
              setSubAddGroupModuleShow(false);
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Edit Template Component modal */}
      <Modal
        show={templateCompShow}
        onHide={() => {
          setTemplateCompShow(false);
        }}
        size={"lg"}
      >
        <Modal.Header>
          <Modal.Title>
            {Trans("TEMPLATE_COMPONENT_LIST", language)}
          </Modal.Title>
          <Button
            variant="danger"
            onClick={() => {
              setTemplateCompShow(false);
            }}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <EditTemplateComponent
            editId={editId}
            RefreshList={RefreshList}
            handleModalClose={() => {
              setTemplateCompShow(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default TreeComponent;
