import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  TemplateSectionGroupStoreUrl,
  tempUploadFileUrl,
  TemplateUrl,
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
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import { useEffect } from "react";

const AddTemplateGroup = (props) => {
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

    POST(TemplateSectionGroupStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
        const { status, data, message } = response.data;
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

  const [templateListing, SetTemplateListing] = useState([]);
  const [sectionListing, SetSectionListing] = useState([]);

  const ModuleLoad = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(TemplateUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetTemplateListing(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });
  };

  const ModuleChange = (e) => {
    let value = e.target.value;
    const sectionLis = value.split("::");
    SetSectionListing(JSON.parse(sectionLis[1]));
  };

  useEffect(() => {
    let abortController = new AbortController();
    ModuleLoad();
    return () => abortController.abort();
  }, []);

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
                htmlFor={Trans("TEMPLATE", language)}
              >
                {Trans("TEMPLATE", language)}
              </Label>
              <select
                id={Trans("TEMPLATE", language)}
                placeholder={Trans("TEMPLATE", language)}
                className="form-control" 
                {...register("template_id", {
                  required: Trans("TEMPLATE_ID_REQUIRED", language),
                })}
                
              >
                <option value="">{Trans("SELECT_TEMPLATE", language)}</option>
                {templateListing &&
                  templateListing.map((curr) => (
                    <option
                      value={curr.template_id}
                      key={curr.template_id}
                    >
                      {curr.template_name}
                    </option>
                  ))}
              </select>

              <span className="required">
                <ErrorMessage errors={errors} name="template_id" />
              </span>
            </FormGroup>
          </Col>

          
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("GROUP_NAME", language)}
                label={Trans("GROUP_NAME", language)}
                placeholder={Trans("GROUP_NAME", language)}
                className="form-control"
                {...register("group_name", {
                  required: Trans("GROUP_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="group_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("GROUP_KEY", language)}
                label={Trans("GROUP_KEY", language)}
                placeholder={Trans("GROUP_KEY", language)}
                className="form-control"
                {...register("group_key", {
                  required: Trans("GROUP_KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="group_key" />
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

export default AddTemplateGroup;
