import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { productOptionsValueStoreUrl, fieldsgroupUrl } from "config/index";
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

const AddOptionValues = (props) => {
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

    POST(productOptionsValueStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
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
                htmlFor={Trans("OPTION_NAME", language)}
              >
                {Trans("OPTION_NAME", language)}
              </Label>
              <select
                {...register("products_options_id", {
                  required: Trans("OPTION_NAME_REQUIRED", language),
                })}
                className="form-control"
              >
                <option value="">{Trans("SELECT_OPTION", language)}</option>
                {props.optionList &&
                  props.optionList.map((opt, idx) => {
                    return (
                      <option value={opt.products_options_id} key={idx}>
                        {opt.products_options_name}
                      </option>
                    );
                  })}
              </select>

              <span className="required">
                <ErrorMessage errors={errors} name="products_options_id" />
              </span>
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("OPTION_VALUE", language)}
                label={Trans("OPTION_VALUE", language)}
                placeholder={Trans("OPTION_VALUE", language)}
                className="form-control"
                {...register("products_options_values_name", {
                  required: Trans("OPTION_VALUE_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage
                  errors={errors}
                  name="products_options_values_name"
                />
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

export default AddOptionValues;
