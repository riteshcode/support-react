import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { languageStoreUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  StatusSelect,
  Input,
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
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    console.log(saveFormData);
    POST(languageStoreUrl, saveFormData)
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
                id="languagename"
                label={Trans("NAME", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("languages_name", {
                  required: "Language name is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="language_code"
                type="text"
                label={Trans("CODE", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("languages_code", {
                  required: "Language short code is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id="icon"
                type="text"
                label={Trans("ICON", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("languages_icon")}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <StatusSelect
                id="Status"
                label={Trans("STATUS", language)}
                hint="Enter text" // for bottom hint
                defaultValue={1}
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
              btnName={Trans("ADD", language)}
              className="btn btn-primary btn-block"
            />
          </Col>
        </Row>
      </form>
    </>
  );
};

export default Create;
