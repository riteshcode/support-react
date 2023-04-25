import React, { useEffect, useState } from "react";
import { roleSectionList } from "config";
import { useSelector } from "react-redux";
import POST from "axios/post";
import Notify from "component/Notify";
import Loading from "component/Loading";
import "assets/css/dashforge.css";
import { Trans } from "lang";
import { useFormContext } from "react-hook-form";

const PermissionUI = (props) => {
  const { register } = useFormContext();

  const { apiToken, language, userType } = useSelector((state) => state.login);
  const [permissionList, setPermissionList] = useState([]);
  const [sectionList, SetSectionList] = useState([]);
  const [contentloadingStatus, SetloadingStatus] = useState(false);

  useEffect(() => {
    const getPerList = () => {
      SetloadingStatus(true);
      const formData = {
        api_token: apiToken,
        userType: userType,
      };
      POST(roleSectionList, formData)
        .then((response) => {
          const { status, data, message } = response.data;
          if (status) {
            setPermissionList(data.permission_list);
            console.log("data.permission_list", data.permission_list);
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
    <React.Fragment>
      {contentloadingStatus ? (
        <Loading />
      ) : (
        <React.Fragment>
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-9">
              <div className="row">
                {permissionList &&
                  permissionList.map((ch, chid) => {
                    return (
                      <React.Fragment key={chid}>
                        <div className="col-md-2 text-center text-uppercase">
                          <b>{ch.permissions_name}</b>
                        </div>
                      </React.Fragment>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="row">
            {sectionList &&
              sectionList.map((section, secindex) => {
                const { section_name, section_id } = section;

                let SecChecked = false;
                const checkedPermission = props.checkedPermission;

                if (checkedPermission !== undefined) {
                  if (checkedPermission.length > 0) {
                    for (
                      let index = 0;
                      index < checkedPermission.length;
                      index += 1
                    ) {
                      if (section_id === checkedPermission[index].section_id) {
                        SecChecked = true;
                      }
                    }
                  }
                }

                return (
                  <React.Fragment key={secindex}>
                    <div className="col-md-3">
                      <label className="">
                        <b>{Trans(section_name, language)}</b>
                      </label>
                    </div>
                    <div className="col-md-9">
                      <div className="row">
                        {permissionList &&
                          permissionList.map((ch, chid) => {
                            return (
                              <div key={chid} className="col-md-2">
                                <select
                                  {...register(
                                    `permission.${section_id}.${ch.permissions_id}`
                                  )}
                                  className=""
                                >
                                  <option value="">
                                    {Trans("SELECT", language)}
                                  </option>
                                  {ch.allow_permission &&
                                    Object.entries(ch.allow_permission).map(
                                      (allow, idxallow) => {
                                        if (allow[1] !== "") {
                                          return (
                                            <option
                                              value={`${allow[1]}`}
                                              key={idxallow}
                                            >
                                              {allow[0]}
                                            </option>
                                          );
                                        }
                                      }
                                    )}
                                </select>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default PermissionUI;
