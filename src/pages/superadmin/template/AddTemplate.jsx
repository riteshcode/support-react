import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  TemplateStoreUrl,
  tempUploadFileUrl,
  industryCreateList,
} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import Select from "react-select";

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

const AddTemplate = (props) => {
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

    POST(TemplateStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, data, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });

          // update side module and section
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
      ).innerHTML = `<img src=${e.target.result} height="100" />`;
    };
    readers.readAsDataURL(event.target.files[0]);

    // upload temp image and bind value to array
    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", event.target.files[0]);
    formdata.append("images_type", 1);
    POST(tempUploadFileUrl, formdata)
      .then((response) => {
        console.log("temp", response);
        setValue(StoreID, response.data.data);
      })
      .catch((error) => {
        Notify(false, error.message);
      });
  };

  const [IndustryTypeList, SetIndustryTypeList] = useState([]);

  const getModuleList = () => {
    const filterData2 = {
      api_token: apiToken,
    };
    POST(industryCreateList, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetIndustryTypeList(data.IndustryTypeList);
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
            <FormGroup mb="20px">
              <Input
                id={Trans("TEMPLATE_NAME", language)}
                label={Trans("TEMPLATE_NAME", language)}
                placeholder={Trans("TEMPLATE_NAME", language)}
                className="form-control"
                {...register("template_name", {
                  required: Trans("TEMPLATE_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="template_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("TEMPLATE_KEY", language)}
                label={Trans("TEMPLATE_KEY", language)}
                placeholder={Trans("TEMPLATE_KEY", language)}
                className="form-control"
                {...register("template_key", {
                  required: Trans("TEMPLATE_KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="template_key" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                type="hidden"
                id={Trans("INDUSTRY", language)}
                label={Trans("INDUSTRY", language)}
                placeholder={Trans("INDUSTRY", language)}
                className="form-control"
                {...register("industry_id", {
                  required: Trans("INDUSTRY_REQUIRED", language),
                })}
              />
              <Select
                isMulti
                name={Trans("INDUSTRY_TYPE", language)}
                options={IndustryTypeList}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(newValue, actionMeta) => {
                  let listArr = [];
                  for (let index = 0; index < newValue.length; index++)
                    listArr[index] = newValue[index].value;

                  listArr = listArr.join(",");
                  console.log("listArr", listArr);
                  setValue("industry_id", listArr);
                }}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="industry_id" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup>
              <Label display="block" mb="5px" htmlFor={"fileupload"}>
                {Trans("TEMPLATE_IMAGE", language)}
              </Label>
              <div className="custom-file">
                <input type="hidden" {...register("images_id")} />
                <input
                  type="file"
                  className="custom-file-input"
                  id="customFile"
                  onChange={(event) =>
                    HandleDocumentUpload(event, "fileupload", "images_id")
                  }
                />
                <label className="custom-file-label" htmlFor="customFile">
                  {Trans("TEMPLATE_IMAGE", language)}
                </label>
                <div id={"fileupload"}></div>
              </div>
            </FormGroup>
          </Col>
          <Col col={12} style={{ marginTop: "5%" }}>
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

export default AddTemplate;
