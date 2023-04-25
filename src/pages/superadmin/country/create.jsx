import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { countryStoreUrl } from "config/index";
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

    if (saveFormData.countries_iso_code_2.length > 2) {
      Notify(false, Trans("COUNTRY_ISO_CODE_2_LENGTH", language));
      return false;
    }

    if (saveFormData.countries_iso_code_3.length > 3) {
      Notify(false, Trans("COUNTRY_ISO_CODE_3_LENGTH", language));
      return false;
    }

    POST(countryStoreUrl, saveFormData)
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
        <input type="hidden" value="1" {...register("address_format_id")} />
        <input type="hidden" value="A" {...register("currencies_code")} />

        <Row>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("COUNTRY_NAME", language)}
                label={Trans("COUNTRY_NAME", language)}
                placeholder={Trans("COUNTRY_NAME", language)}
                className="form-control"
                {...register("countries_name", {
                  required: Trans("COUNTRY_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="countries_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("COUNTRIES_ISO_CODE_2", language)}
                label={Trans("COUNTRIES_ISO_CODE_2", language)}
                placeholder={Trans("COUNTRIES_ISO_CODE_2", language)}
                className="form-control"
                {...register("countries_iso_code_2", {
                  required: Trans("COUNTRIES_ISO_CODE_2_REQUIRED", language),
                  maxLength: 2,
                  minLength: 2,
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="countries_iso_code_2" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("COUNTRIES_ISO_CODE_3", language)}
                label={Trans("COUNTRIES_ISO_CODE_3", language)}
                placeholder={Trans("COUNTRIES_ISO_CODE_3", language)}
                className="form-control"
                {...register("countries_iso_code_3", {
                  required: Trans("COUNTRIES_ISO_CODE_3_REQUIRED", language),
                  maxLength: 3,
                  minLength: 3,
                })}
              />

              <span className="required">
                <ErrorMessage errors={errors} name="countries_iso_code_3" />
              </span>
            </FormGroup>
          </Col>

          <Col col={6}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("CURRENCY", language)}
              >
                {Trans("CURRENCY", language)}
              </Label>
              <select
                id={Trans("CURRENCY", language)}
                placeholder={Trans("CURRENCY", language)}
                className="form-control"
                {...register("currencies_id", {
                  required: Trans("CURRENCY_REQUIRED", language),
                })}
              >
                <option value="">{Trans("SELECT_CURRENCY", language)}</option>
                {props.currencyList &&
                  props.currencyList.map((curr) => (
                    <option value={curr.currencies_id} key={curr.currencies_id}>
                      {curr.currencies_code}
                    </option>
                  ))}
              </select>

              <span className="required">
                <ErrorMessage errors={errors} name="currencies_id" />
              </span>
            </FormGroup>
          </Col>

          <Col col={6}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("LANGUAGE", language)}
              >
                {Trans("LANGUAGE", language)}
              </Label>
              <select
                id={Trans("LANGUAGE", language)}
                placeholder={Trans("LANGUAGE", language)}
                className="form-control"
                {...register("languages_id", {
                  required: Trans("LANGUAGE_REQUIRED", language),
                })}
              >
                <option value="">{Trans("SELECT_LANGUAGE", language)}</option>
                {props.languageList &&
                  props.languageList.map((curr) => (
                    <option value={curr.languages_id} key={curr.languages_id}>
                      {curr.languages_name}
                    </option>
                  ))}
              </select>

              <span className="required">
                <ErrorMessage errors={errors} name="languages_id" />
              </span>
            </FormGroup>
          </Col>

          <Col col={6}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("TIME_ZONE", language)}
              >
                {Trans("TIME_ZONE", language)}
              </Label>
              <select
                id={Trans("TIME_ZONE", language)}
                placeholder={Trans("TIME_ZONE", language)}
                className="form-control"
                {...register("time_zone_id", {
                  required: Trans("TIME_ZONE_REQUIRED", language),
                })}
              >
                <option value="">{Trans("SELECT_TIME_ZONE", language)}</option>
                {props.timezoneList &&
                  props.timezoneList.map((curr) => (
                    <option value={curr.timezone_id} key={curr.timezone_id}>
                      {curr.timezone_location}
                    </option>
                  ))}
              </select>

              <span className="required">
                <ErrorMessage errors={errors} name="time_zone_id" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                type="time"
                id={Trans("UTC_TIME", language)}
                label={Trans("UTC_TIME", language)}
                placeholder={Trans("UTC_TIME", language)}
                className="form-control"
                {...register("utc_time", {
                  required: Trans("UTC_TIME_REQUIRED", language),
                })}
              />

              <span className="required">
                <ErrorMessage errors={errors} name="utc_time" />
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
