import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { paymentMethodStoreUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
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
  } = useForm();

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
              <Input
                id={Trans("LOGO_URL", language)}
                label={Trans("LOGO_URL", language)}
                placeholder={Trans("LOGO_URL", language)}
                className="form-control"
                {...register("method_logo", {
                  required: Trans("LOGO_URL_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="method_logo" />
              </span>
            </FormGroup>
          </Col>
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
