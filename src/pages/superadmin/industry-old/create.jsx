import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { industryStoreUrl, industryCreateList } from "config/index";
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
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";
import { useEffect } from "react";

const Create = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);

    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(industryStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });
          console.log(props);
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
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getModuleList();
    return () => abortController.abort(); //getModuleList();
  }, []);

  return (
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
        <input type="hidden" value="1" {...register("address_format_id")} />
        <input type="hidden" value="A" {...register("currencies_code")} />

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

              <Select
                isMulti
                name={Trans("MODULE", language)}
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

              <Select
                isMulti
                name={Trans("WEB_FUNCTIONS", language)}
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
  );
};

export default Create;
