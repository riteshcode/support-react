import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { WebFeatureStoreUrl, tempUploadFileUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  TextArea,
  StatusSelect,
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
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(WebFeatureStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          props.handleModalClose();
          Notify(true, Trans(message, language));
          props.filterItem("refresh", "", "");
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
      })
      .catch((error) => {
        console.log(error);
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
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="FEATURE_TITLE"
                label={Trans("FEATURE_TITLE", language)}
                placeholder={Trans("FEATURE_TITLE", language)}
                className="form-control"
                {...register("feature_title", {
                  required: Trans("FEATURE_TITLE_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="feature_title" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <label>
                <b>
                  {Trans("FEATURE_ICON")} <span className="error">*</span>{" "}
                </b>
              </label>
              <input type="hidden" {...register(`feature_icon`)} />
              <input
                placeholder="Setting Value"
                className="form-control"
                type="file"
                onChange={(event) =>
                  HandleDocumentUpload(event, `fileupload`, `feature_icon`)
                }
              />
              <span className="infoInput"></span>
              <div id={`fileupload`}></div>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="FEATURE_SUB_TITLE"
                label={Trans("FEATURE_SUB_TITLE", language)}
                placeholder={Trans("FEATURE_SUB_TITLE", language)}
                className="form-control"
                {...register("feature_subtitle", {
                  required: Trans("FEATURE_SUB_TITLE_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="feature_subtitle" />
              </span>
            </FormGroup>
          </Col>

          <Col col={12}>
            <LoaderButton
              formLoadStatus={formloadingStatus}
              btnName={Trans("CREATE", language)}
              className="btn btn-primary btn-block"
            />
          </Col>
        </Row>
      </form>
    </>
  );
};

export default Create;
