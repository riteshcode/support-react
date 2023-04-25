import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  paymentMethodStoreUrl,
  tempUploadFileUrl,
  CountryList,
} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import { useEffect } from "react";
import Select from "react-select";

import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  Label,
  TextArea,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";

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
  const [moduleList, SetmoduleList] = useState([]);
  const [manageType, SetManageType] = useState(false);

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    console.log(saveFormData);

    POST(paymentMethodStoreUrl, saveFormData)
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
  const HandleDocumentUpload = (event, previewUrlId, StoreID) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;

    var readers = new FileReader();
    readers.onload = function (e) {
      console.log("filereade", e);
      document.getElementById(
        previewUrlId
      ).innerHTML = `<a href=${e.target.result} download >Preview</a>`;
    };
    readers.readAsDataURL(event.target.files[0]);

    // upload temp image and bind value to array
    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", event.target.files[0]);
    POST(tempUploadFileUrl, formdata)
      .then((response) => {
        console.log("temp", response);
        setValue(StoreID, response.data.data);
      })
      .catch((error) => {
        Notify(false, error.message);
      });
  };
  const getModuleList = () => {
    const filterData2 = {
      api_token: apiToken,
    };
    POST(CountryList, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetmoduleList(data.country_list);
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
        <Row>
          <Col col={12}>
            <FormGroup>
              <Input
                id={Trans("PAYMENT_METHOD", language)}
                label={Trans("PAYMENT_METHOD", language)}
                placeholder={Trans("PAYMENT_METHOD", language)}
                className="form-control"
                {...register("method_name", {
                  required: Trans("PAYMENT_METHOD_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="method_name" />
              </span>
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup>
              <label>
                <b>{Trans("LOGO_URL")} </b>
              </label>
              <input type="hidden" {...register(`method_logo`)} />
              <input
                placeholder="Setting Value"
                className="form-control"
                type="file"
                onChange={(event) =>
                  HandleDocumentUpload(event, `fileupload`, `method_logo`)
                }
              />
              <span className="infoInput"></span>
              <div id={`fileupload`}></div>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                type="hidden"
                id={Trans("COUNTRY", language)}
                label={Trans("COUNTRY", language)}
                placeholder={Trans("COUNTRY", language)}
                className="form-control"
                {...register("enabled_country", {
                  required: Trans("CHOOSE_COUNTRY_REQUIRED", language),
                })}
              />

              <Select
                isMulti
                name={Trans("COUNTRY", language)}
                options={moduleList}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(newValue, actionMeta) => {
                  let listArr = [];
                  for (let index = 0; index < newValue.length; index++)
                    listArr[index] = newValue[index].value;

                  listArr = listArr.join(",");
                  console.log("listArr", listArr);
                  setValue("enabled_country", listArr);
                }}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="countries_id" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup>
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("KEY_MANAGE", language)}
              >
                {Trans("KEY_MANAGE", language)}{" "}
                <span className="required">*</span>
              </Label>
              <input
                style={{ marginLeft: 10 }}
                id={Trans("KEY_MANAGE", language)}
                type="checkbox"
                placeholder={Trans("KEY_MANAGE", language)}
                {...register("is_key_managable")}
                onClick={() => {
                  SetManageType(manageType === 1 ? 0 : 1);
                }}
              />
            </FormGroup>
          </Col>
          {manageType === 1 && (
            <>
              <Col col={12}>
                <FormGroup>
                  <TextArea
                    id={Trans("PAYMENT_METHOD_KEY", language)}
                    label={Trans("PAYMENT_METHOD_KEY", language)}
                    placeholder="Enter all key with comma seperate"
                    className="form-control"
                    {...register("method_key", {
                      required: Trans("PAYMENT_METHOD_KEY_REQUIRED", language),
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup>
                  <TextArea
                    id={Trans("PAYMENT_METHOD_DESC", language)}
                    label={Trans("PAYMENT_METHOD_DESC", language)}
                    placeholder={Trans("PAYMENT_METHOD_DESC", language)}
                    className="form-control"
                    {...register("method_description", {
                      required: Trans("PAYMENT_METHOD_DESC_REQUIRED", language),
                    })}
                  />
                </FormGroup>
              </Col>
            </>
          )}

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
