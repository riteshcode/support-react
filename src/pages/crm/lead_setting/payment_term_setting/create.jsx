import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { PaymentTermSettingStoreUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
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
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(PaymentTermSettingStoreUrl, saveFormData)
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
                id="TERM_NAME"
                label={Trans("TERM_NAME", language)}
                placeholder={Trans("TERM_NAME", language)}
                className="form-control"
                {...register("terms_name", {
                  required: Trans("TERM_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="terms_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id="ADVANCE_PAYMENT"
                type="number"
                label={Trans("ADVANCE_PAYMENT", language)}
                placeholder={Trans("ADVANCE_PAYMENT", language)}
                className="form-control"
                {...register("advance_payment", {
                  required: Trans("ADVANCE_PAYMENT_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="advance_payment" />
              </span>
            </FormGroup>
          </Col>{" "}
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id="BALANCE_PAYMENT"
                type="number"
                label={Trans("BALANCE_PAYMENT", language)}
                placeholder={Trans("BALANCE_PAYMENT", language)}
                className="form-control"
                {...register("balance_payment", {
                  required: Trans("BALANCE_PAYMENT_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="balance_payment" />
              </span>
            </FormGroup>
          </Col>{" "}
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
