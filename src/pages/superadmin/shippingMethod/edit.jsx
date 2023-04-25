import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  shippingMethodUpdateUrl,
  shippingMethodEditUrl,
  tempUploadFileUrl,
  CountryCreateList,
} from "config/index";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Select from "react-select";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  Label,
  TextArea,
} from "component/UIElement/UIElement";
import Loading from "component/Preloader";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";

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
  const [manageType, SetManageType] = useState(false);

  const [moduleList, SetmoduleList] = useState([]);
  const [selectedCountryList, SetselectedCountryList] = useState("");

  const { editData } = props;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(shippingMethodUpdateUrl, saveFormData)
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

  function setValueToField() {
    const editInfo = {
      api_token: apiToken,
      method_id: editData,
    };
    POST(shippingMethodEditUrl, editInfo)
      .then((response) => {
        SetloadingStatus(false);
        const { data } = response.data;
        SetManageType(data.is_key_managable);
        SetselectedCountryList(data.selectedCountry);

        const fieldList = getValues();
        for (const key in fieldList) {
          console.log(key, data[key]);
          setValue(key, data[key]);
        }
      })
      .catch((error) => {
        console.log(error);
        SetloadingStatus(false);
        Notify(false, error.message);
      });
  }

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
    POST(CountryCreateList, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetmoduleList(data.country_list);
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
    return () => abortController.abort(); //getModuleList();
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
            <input type="hidden" {...register("method_id")} />

            <Row>
              <Col col={12}>
                <FormGroup>
                  <Input
                    id={Trans("SHIPPING_METHOD", language)}
                    label={Trans("SHIPPING_METHOD", language)}
                    placeholder={Trans("SHIPPING_METHOD", language)}
                    className="form-control"
                    {...register("method_name", {
                      required: Trans("SHIPPING_METHOD_REQUIRED", language),
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
                  {selectedCountryList && (
                    <Select
                      isMulti
                      name={Trans("COUNTRY", language)}
                      defaultValue={selectedCountryList}
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
                  )}
                  <span className="required">
                    <ErrorMessage errors={errors} name="enabled_country" />
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
                        id={Trans("SHIPPING_METHOD_KEY", language)}
                        label={Trans("SHIPPING_METHOD_KEY", language)}
                        placeholder="Enter all key with comma seperate"
                        className="form-control"
                        {...register("method_key", {
                          required: Trans(
                            "SHIPPING_METHOD_KEY_REQUIRED",
                            language
                          ),
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={12}>
                    <FormGroup>
                      <TextArea
                        id={Trans("SHIPPING_METHOD_DESC", language)}
                        label={Trans("SHIPPING_METHOD_DESC", language)}
                        placeholder={Trans("SHIPPING_METHOD_DESC", language)}
                        className="form-control"
                        {...register("method_description", {
                          required: Trans(
                            "SHIPPING_METHOD_DESC_REQUIRED",
                            language
                          ),
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
      )}
    </>
  );
};

export default Edit;
