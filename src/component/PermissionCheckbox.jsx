import React, { useEffect, useState } from "react";
import { moduleParentSectionListUrl } from "config";
import { useSelector } from "react-redux";
import POST from "axios/post";
import Notify from "component/Notify";
import Loading from "./Loading";
import "assets/css/dashforge.css";

const PermissionCheckbox = (props) => {
  const { apiToken } = useSelector((state) => state.login);
  const [permissionList, setPermissionList] = useState([]);
  const [sectionList, SetSectionList] = useState([]);
  const [contentloadingStatus, SetloadingStatus] = useState(false);

  useEffect(() => {
    const getPerList = () => {
      SetloadingStatus(true);
      const formData = {
        api_token: apiToken,
      };
      POST(moduleParentSectionListUrl, formData)
        .then((response) => {
          const { status, data, message } = response.data;
          if (status) {
            setPermissionList(data.permission_list);
            SetSectionList(data.section_list);
          } else Notify(false, message);
          SetloadingStatus(false);
        })
        .catch((error) => {
          console.error("There was an error!", error);
          SetloadingStatus(false);
        });
    };
    getPerList();
    return () => {
      getPerList();
    };
  }, [apiToken]);

  const HandleCheckbox = (e, label) => {
    const listItem = document.querySelectorAll(`.${label}`);
    if (e.target.checked) {
      for (let index = 0; index < listItem.length; index++)
        listItem[index].setAttribute("checked", true);
    } else {
      for (let index = 0; index < listItem.length; index++)
        listItem[index].removeAttribute("checked");
    }
  };

  const [collapseShow, SetcollapseShow] = useState("");
  const handleCollapse = (sectionName) => {
    SetcollapseShow(sectionName);
    // console.log(collapseShow);
  };

  return (
    <>
      {contentloadingStatus ? (
        <Loading />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <div data-label="Style 2" className="df-example">
                <div
                  id="accordion4"
                  className="accordion accordion-style2 ui-accordion ui-widget ui-helper-reset"
                >
                  {sectionList &&
                    sectionList.map((section, index) => {
                      const { section_name, section_id, section_slug } =
                        section;

                      let SecChecked = false;
                      const checkedPermission = props.checkedPermission;
                      console.log("checkedPermission", checkedPermission);

                      if (checkedPermission !== undefined) {
                        if (checkedPermission.length > 0) {
                          for (
                            let index = 0;
                            index < checkedPermission.length;
                            index += 1
                          ) {
                            if (
                              section_id === checkedPermission[index].section_id
                            ) {
                              SecChecked = true;
                              // break;
                            }
                          }
                        }
                      }

                      // console.log("checkedPermission", typeof SecChecked);
                      console.log("SecChecked", typeof SecChecked);

                      const SecIdName = section_slug + "_" + section_id;

                      let headerClass =
                        "accordion-title ui-accordion-header ui-corner-top ui-accordion-header-collapsed ui-corner-all ui-state-default ui-accordion-icons";
                      let bodyClass = "hide";

                      if (SecIdName === collapseShow) {
                        headerClass =
                          "accordion-title ui-accordion-header ui-corner-top ui-state-default ui-accordion-header-active ui-state-active ui-accordion-icons";
                        bodyClass =
                          "accordion-body ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content";
                      }

                      return (
                        <div
                          key={index}
                          style={{ marginTop: 10, marginBottom: 10 }}
                        >
                          <h6
                            onClick={() => {
                              handleCollapse(SecIdName);
                            }}
                            className={headerClass}
                          >
                            <input
                              type="checkbox"
                              key={section.id}
                              className="custom-control-input permissionBox"
                              id={`${props.Compname}OR${SecIdName}`}
                              label={SecIdName}
                              name={props.Compname}
                              value={section.id}
                              defaultChecked={SecChecked}
                              onClick={(e) => HandleCheckbox(e, SecIdName)}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`${props.Compname}OR${SecIdName}`}
                            >
                              {section_name}
                            </label>
                          </h6>
                          <div className={bodyClass}>
                            <div className="row">
                              <div className="col-md-12">
                                {permissionList &&
                                  permissionList.map((ch, chid) => {
                                    let checked = "";

                                    return (
                                      <div key={chid} className="col-md-12">
                                        {checked === "checked" ? (
                                          <input
                                            type="checkbox"
                                            key={ch.permissions_id}
                                            className={`custom-control-input permissionBox ${SecIdName}`}
                                            id={`${props.Compname}OR${SecIdName}OR${section.permissions_id}`}
                                            label={SecIdName}
                                            name={props.Compname}
                                            value={`${section.section_id}::${ch.permissions_id}`}
                                            checked="checked"
                                          />
                                        ) : (
                                          <input
                                            type="checkbox"
                                            key={ch.id}
                                            className={`custom-control-input permissionBox ${SecIdName}`}
                                            id={`${props.Compname}OR${SecIdName}OR${section.permissions_id}`}
                                            label={SecIdName}
                                            name={props.Compname}
                                            value={`${section.section_id}::${ch.permissions_id}`}
                                          />
                                        )}
                                        <label
                                          className="custom-control-label"
                                          htmlFor={`${props.Compname}OR${SecIdName}OR${section.permissions_id}`}
                                        >
                                          {ch.permissions_name.replace(
                                            section_name,
                                            " "
                                          )}
                                        </label>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PermissionCheckbox;
