import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  industryUpdateUrl,
  industryEditUrl,
  industryCreateList,
} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  Label,
} from "component/UIElement/UIElement";
import Loading from "component/Preloader";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";
import { useEffect } from "react";

const Edit = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const { editData } = props;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(industryUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });
          props.filterItem("refresh", "", "");
          props.handleModalClose();
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
        setError({
          status: true,
          msg: error.message,
          type: "danger",
        });
      });
  };

  const [moduleList, SetmoduleList] = useState([]);
  const [webfunctionList, SetwebfunctionList] = useState([]);
  const [webfunctionSelected, SetwebfunctionSelected] = useState();
  const [moduleSelected, SetmoduleSelected] = useState();

  const setValueToField = () => {
    const editInfo = {
      api_token: apiToken,
      industry_id: editData,
    };
    POST(industryEditUrl, editInfo)
      .then((response) => {
        SetloadingStatus(false);
        const { data } = response.data;
        console.log("edit data", data);
        const fieldList = getValues();
        for (const key in fieldList) setValue(key, data[key]);

        //module selected item show
        const module = data.modules;
        let selectedItem = [];
        let listArr = [];
        if (module.length > 0) {
          for (let index = 0; index < module.length; index++) {
            selectedItem.push({
              label: module[index].module_name,
              value: module[index].module_id,
            });
            listArr[index] = module[index].module_id;
          }
        }
        SetmoduleSelected(selectedItem);
        setValue("module_id", listArr.join(","));

        //web function  selected item show
        const web_functions = data.web_functions;
        let selectedWebFunc = [];
        let listWebFunc = [];
        if (web_functions.length > 0) {
          for (let index = 0; index < web_functions.length; index++) {
            selectedWebFunc.push({
              label: web_functions[index].function_name,
              value: web_functions[index].function_id,
            });
            listWebFunc[index] = web_functions[index].function_id;
          }
        }
        console.log("selectedWebFunc", selectedWebFunc);
        SetwebfunctionSelected(selectedWebFunc);
        setValue("function_id", listWebFunc.join(","));
      })
      .catch((error) => {
        console.log(error);
        SetloadingStatus(false);
        alert(error.message);
      });
  };

  // load module and webfunctions
  const getModuleList = () => {
    const filterData2 = {
      api_token: apiToken,
    };
    POST(industryCreateList, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetmoduleList(data.module_list);
          SetwebfunctionList(data.webfunction);
          setValueToField();
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getModuleList();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      {contentloadingStatus ? (
        <Loading />
      ) : (
        <>
          {error.status && (
            <Alert
              variant={error.type}
              onClose={() => setError({ status: false, msg: "", type: "" })}
              dismissible
            >
              {error.msg}
            </Alert>
          )}
          <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
            <input type="hidden" {...register("industry_id")} />
            <Row>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("INDUSTRY_NAME", language)}
                    label={Trans("INDUSTRY_NAME", language)}
                    placeholder={Trans("INDUSTRY_NAME", language)}
                    className="form-control"
                    {...register("industry_name", {
                      required: Trans("INDUSTRY_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="industry_name" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    type="number"
                    id={Trans("SORT_ORDER", language)}
                    label={Trans("SORT_ORDER", language)}
                    placeholder={Trans("SORT_ORDER", language)}
                    className="form-control"
                    {...register("sort_order", {
                      required: Trans("SORT_ORDER_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="sort_order" />
                  </span>
                </FormGroup>
              </Col>

              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    type="hidden"
                    id={Trans("MODULE", language)}
                    label={Trans("MODULE", language)}
                    placeholder={Trans("MODULE", language)}
                    className="form-control"
                    {...register("module_id", {
                      required: Trans("CHOOSE_MODULE_REQUIRED", language),
                    })}
                  />
                  {moduleSelected && (
                    <Select
                      isMulti
                      name={Trans("MODULE", language)}
                      defaultValue={moduleSelected}
                      options={moduleList}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(newValue, actionMeta) => {
                        let listArr = [];
                        for (let index = 0; index < newValue.length; index++)
                          listArr[index] = newValue[index].value;

                        listArr = listArr.join(",");
                        console.log("listArr", listArr);
                        setValue("module_id", listArr);
                      }}
                    />
                  )}
                  <span className="required">
                    <ErrorMessage errors={errors} name="module_id" />
                  </span>
                </FormGroup>
              </Col>

              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    type="hidden"
                    id={Trans("WEB_FUNCTIONS", language)}
                    label={Trans("WEB_FUNCTIONS", language)}
                    placeholder={Trans("WEB_FUNCTIONS", language)}
                    className="form-control"
                    {...register("function_id", {
                      required: Trans("WEB_FUNCTIONS_REQUIRED", language),
                    })}
                  />

                  {webfunctionSelected && (
                    <Select
                      isMulti
                      name={Trans("WEB_FUNCTIONS", language)}
                      defaultValue={webfunctionSelected}
                      options={webfunctionList}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(newValue, actionMeta) => {
                        let listArr = [];
                        for (let index = 0; index < newValue.length; index++)
                          listArr[index] = newValue[index].value;

                        listArr = listArr.join(",");
                        console.log("listArr", listArr);
                        setValue("function_id", listArr);
                      }}
                    />
                  )}
                  <span className="required">
                    <ErrorMessage errors={errors} name="function_id" />
                  </span>
                </FormGroup>
              </Col>

              <Col col={12}>
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("SUBMIT", language)}
                  className="btn btn-primary btn-block"
                />
              </Col>
            </Row>
          </form>
        </>
      )}
    </>
  );
};

export default Edit;
