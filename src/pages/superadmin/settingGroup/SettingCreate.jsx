import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { AppSettingStoreUrl,tempUploadFileUrl ,CountryList,AppSettingCreateUrl} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import { useEffect } from "react";
import Select from "react-select";

import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Label,
  StatusSelect,
  Input,
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


  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    console.log(saveFormData);

    POST(AppSettingStoreUrl, saveFormData)
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


  const [sectionListing, SetSectionListing] = useState([]);

  const ModuleLoad = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(AppSettingCreateUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetSectionListing(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    ModuleLoad();
    return () => abortController.abort();
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
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("SECTION", language)}
              >
                {Trans("GROUP", language)}
              </Label>
              <select
                id={Trans("SECTION", language)}
                placeholder={Trans("SECTION", language)}
                className="form-control"
                {...register("group_id", {
                  required: Trans("SECTION_REQUIRED", language),
                })}
              >
                <option value="">{Trans("SELECT_GROUP", language)}</option>
                {sectionListing &&
                  sectionListing.map((curr, idx) => (
                    <option value={curr.group_id} key={idx}>
                      {curr.group_name}
                    </option>
                  ))}
              </select>
              <span className="required">
                <ErrorMessage errors={errors} name="group_id" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
          <FormGroup>
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("OPTIONS_TYPE", language)}
              >
                {Trans("OPTIONS_TYPE", language)}{" "}
                <span className="required">*</span>
              </Label>
              <select
                id={Trans("ACCESS_PRIVILEGE", language)}
                className="form-control"
                {...register("option_type")}
              >
                <option value="">{Trans("SELECT_OPTIONS_TYPE", language)}</option>
                <option value="text">text</option>
                <option value="dropdown">dropdown</option>
                <option value="radio">radio</option>
                <option value="checkbox">checkbox</option>
                <option value="image">image</option>

            </select>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SETTING_KEYS", language)}
                label={Trans("SETTING_KEYS", language)}
                placeholder="For Multiple (ABC,BCD) use comma seperate"
                className="form-control"
                {...register("setting_key", {
                  required: Trans("KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="setting_key" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SETTING_NAME", language)}
                label={Trans("SETTING_NAME", language)}
                placeholder="For Multiple (ABC,BCD) use comma seperate"
                className="form-control"
                {...register("setting_name", {
                  required: Trans("KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="setting_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SETTING_OPTIONS", language)}
                label={Trans("SETTING_OPTIONS", language)}
                placeholder="For Multiple (ABC,BCD) use comma seperate"
                className="form-control"
                {...register("setting_options", {
                  required: Trans("KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="setting_options" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
          <FormGroup mb="20px">
              <StatusSelect
                id="Status"
                label={Trans("STATUS", language)}
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("status", {
                  required: Trans("STATUS_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="status" />
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
