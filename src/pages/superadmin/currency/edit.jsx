import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { currencyUpdateUrl, currencyEditUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import Loading from "component/Preloader";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
} from "component/UIElement/UIElement";
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
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(currencyUpdateUrl, saveFormData)
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

  const { editData } = props;

  useEffect(() => {
    function setValueToField() {
      const editInfo = {
        api_token: apiToken,
        currencies_id: editData,
      };
      POST(currencyEditUrl, editInfo)
        .then((response) => {
          SetloadingStatus(false);
          const { data } = response.data;

          const fieldList = getValues();
          for (const key in fieldList) {
            console.log(key, data[key]);
            setValue(key, data[key]);
          }
        })
        .catch((error) => {
          console.log(error);
          SetloadingStatus(false);
          alert(error.message);
        });
    }

    setValueToField();
    return () => {
      setValueToField();
    };
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
            <input type="hidden" {...register("currencies_id")} />
            <input type="hidden" value="." {...register("decimal_point")} />
            <input type="hidden" value="," {...register("thousands_point")} />
            <Row>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("CURRENCY_NAME", language)}
                    label={Trans("CURRENCY_NAME", language)}
                    placeholder={Trans("CURRENCY_NAME", language)}
                    className="form-control"
                    {...register("currencies_name", {
                      required: Trans("CURRENCY_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="currencies_name" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("CURRENCY_CODE", language)}
                    label={Trans("CURRENCY_CODE", language)}
                    placeholder={Trans("CURRENCY_CODE", language)}
                    className="form-control"
                    {...register("currencies_code", {
                      required: Trans("CURRENCY_CODE_REQUIRED", language),
                      minLength: 3,
                      maxLength: 3,
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="currencies_code" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("SYMBOL_LEFT", language)}
                    label={Trans("SYMBOL_LEFT", language)}
                    placeholder={Trans("SYMBOL_LEFT", language)}
                    className="form-control"
                    {...register("symbol_left")}
                  />

                  <span className="required">
                    <ErrorMessage errors={errors} name="symbol_left" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("SYMBOL_RIGHT", language)}
                    label={Trans("SYMBOL_RIGHT", language)}
                    placeholder={Trans("SYMBOL_RIGHT", language)}
                    className="form-control"
                    {...register("symbol_right")}
                  />

                  <span className="required">
                    <ErrorMessage errors={errors} name="symbol_right" />
                  </span>
                </FormGroup>
              </Col>

              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("DECIMAL_PLACES", language)}
                    label={Trans("DECIMAL_PLACES", language)}
                    placeholder={Trans("DECIMAL_PLACES", language)}
                    className="form-control"
                    {...register("decimal_places", {
                      required: Trans("DECIMAL_PLACES_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="decimal_places" />
                  </span>
                </FormGroup>
              </Col>

              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("VALUE", language)}
                    label={Trans("VALUE", language)}
                    placeholder={Trans("VALUE", language)}
                    className="form-control"
                    {...register("value", {
                      required: Trans("VALUE_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="value" />
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
      )}
    </>
  );
};

export default Edit;
