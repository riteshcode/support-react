import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  TemplateComponentSettingStoreUrl,
  TemplateComponentListUrl,
  TemplateComponentSettingDelUrl,
} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  IconButton,
  Label,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import Loading from "component/Preloader";
import { ErrorMessage } from "@hookform/error-message";
import FeatherIcon from "feather-icons-react";
import Select from "react-select";

const ManageFeatureProduct = ({ editId, RefreshList, handleModalClose }) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(TemplateComponentSettingStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          getTemplateComponentList();
          Notify(true, Trans(message, language));
        } else {
          var errObj = {
            status: true,
            msg: "",
            type: "danger",
          };

          if (typeof message === "object") {
            let errMsg = "";
            Object.keys(message).map((key) => {
              errMsg += Trans(message[key][0], language);
              return errMsg;
            });
            errObj.msg = errMsg;
          } else {
            errObj.msg = message;
          }
          setError(errObj);
        }
        SetformloadingStatus(false);
      })
      .catch((error) => {
        console.log(error);
        SetformloadingStatus(false);
        Notify(true, Trans(error.message, language));
      });
  };

  const [allComponentList, setAllComponentList] = useState([]);
  const [componentList, setSelectComponentList] = useState([]);

  const getTemplateComponentList = () => {
    setValue("template_id", editId);
    const editInfo = {
      api_token: apiToken,
      template_id: editId,
    };

    POST(TemplateComponentListUrl, editInfo)
      .then((response) => {
        const { data } = response.data;
        SetloadingStatus(false);
        setSelectComponentList(data.setting_details);
        setAllComponentList(data.component_list);
      })
      .catch((error) => {
        SetloadingStatus(false);
        Notify(true, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getTemplateComponentList();
    return () => abortController.abort();
  }, []);

  // delete item
  const deleteFeatuerdProduct = (deleteId) => {
    const editInfo = {
      api_token: apiToken,
      setting_id: deleteId,
    };
    POST(TemplateComponentSettingDelUrl, editInfo)
      .then((response) => {
        const { status, message } = response.data;
        Notify(true, Trans(message, language));
        getTemplateComponentList();
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  return (
    <React.Fragment>
      {contentloadingStatus ? (
        <Loading />
      ) : (
        <React.Fragment>
          <Row>
            <Col col={12}>
              <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                <input type="hidden" {...register("template_id")} />
                <Row>
                  <Col col={10}>
                    <FormGroup mb="20px">
                      <input
                        type="hidden"
                        id={Trans("COMPONENT", language)}
                        label={Trans("COMPONENT", language)}
                        placeholder={Trans("COMPONENT", language)}
                        className="form-control"
                        {...register("component_id", {
                          required: Trans(
                            "CHOOSE_COMPONENT_REQUIRED",
                            language
                          ),
                        })}
                      />

                      <Select
                        isMulti
                        name={Trans("ALL_COMPONENT", language)}
                        options={allComponentList}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(newValue, actionMeta) => {
                          let listArr = [];
                          for (let index = 0; index < newValue.length; index++)
                            listArr[index] = newValue[index].value;

                          listArr = listArr.join(",");
                          setValue("component_id", listArr);
                        }}
                      />
                      <span className="required">
                        <ErrorMessage errors={errors} name="component_id" />
                      </span>
                    </FormGroup>
                  </Col>
                  <Col col={2}>
                    <LoaderButton
                      formLoadStatus={formloadingStatus}
                      btnName={Trans("ADD", language)}
                      className="btn btn-info btn-sm"
                    />
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>

          <Row>
            <Col col={12}>
              <div className="card" id="custom-user-list">
                <div className="card-body">
                  <Row>
                    <Col col={12}>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>{Trans("SL_NO", language)}</th>
                              <th>{Trans("COMPONENT_NAME", language)}</th>
                              <th>{Trans("COMPONENT_KEY", language)}</th>
                              <th className="text-center">
                                {Trans("ACTION", language)}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {componentList &&
                              componentList.map((cat, IDX) => {
                                const { setting_id } = cat;
                                return (
                                  <React.Fragment key={IDX}>
                                    <tr>
                                      <td>{IDX + 1}</td>
                                      <td>
                                        {cat?.component_details?.component_name}
                                      </td>
                                      <td>
                                        {cat?.component_details?.component_key}
                                      </td>
                                      <td className="text-center">
                                        <button
                                          type="button"
                                          className="btn btn-danger"
                                        >
                                          <FeatherIcon
                                            icon="x-circle"
                                            size={20}
                                            onClick={() => {
                                              deleteFeatuerdProduct(setting_id);
                                            }}
                                          />
                                        </button>
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col col={12}></Col>
          </Row>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ManageFeatureProduct;
