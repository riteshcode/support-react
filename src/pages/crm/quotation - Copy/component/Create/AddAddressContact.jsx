import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { QuotationCustomerInfoStoreStatusUrl } from "config/index";
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

const AddAddressContact = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const { country, customerId, contactType, pushElement } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(QuotationCustomerInfoStoreStatusUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, data, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          pushElement(data, contactType);
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
        <input
          type="hidden"
          {...register(`customer_id`)}
          defaultValue={customerId}
        />
        <input
          type="hidden"
          {...register(`contact_type`)}
          defaultValue={contactType}
        />

        {/* contact */}
        {contactType === "contact" && (
          <Row>
            <Col col={5}>
              <FormGroup mb="20px">
                <Input
                  id="CUSTOMER_NAME"
                  label={Trans("CUSTOMER_NAME", language)}
                  placeholder={Trans("CUSTOMER_NAME", language)}
                  className="form-control"
                  {...register(`contact_name`, {
                    required: Trans("CUSTOMER_NAME_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage errors={errors} name={`contact_name`} />
                </span>
              </FormGroup>
            </Col>
            <Col col={6}>
              <FormGroup mb="20px">
                <Input
                  id="CUSTOMER_EMAIL"
                  label={Trans("CUSTOMER_EMAIL", language)}
                  placeholder={Trans("CUSTOMER_EMAIL", language)}
                  className="form-control"
                  {...register(`contact_email`, {
                    required: Trans("CUSTOMER_EMAIL_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage errors={errors} name={`contact_email`} />
                </span>
              </FormGroup>
            </Col>
          </Row>
        )}

        {/* Address */}
        {contactType === "address" && (
          <Row>
            <Col col={4}>
              <FormGroup mb="20px">
                <label>
                  <b>{Trans("ADDRESS_TYPE", language)}</b>
                </label>
                <select
                  id="ADDRESS_TYPE"
                  label={Trans("ADDRESS_TYPE", language)}
                  placeholder={Trans("ADDRESS_TYPE", language)}
                  className="form-control"
                  {...register(`address_type`, {
                    required: Trans("ADDRESS_TYPE_REQUIRED", language),
                  })}
                >
                  <option value="">{Trans("SELECT_ADDRESS_TYPE")}</option>
                  <option value={1}>{Trans("COMMON")}</option>
                  <option value={2}>{Trans("BILLING")}</option>
                  <option value={3}>{Trans("SHIPPING")}</option>
                </select>
                <span className="required">
                  <ErrorMessage errors={errors} name={`address_type`} />
                </span>
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="STREET_ADDRESS"
                  label={Trans("STREET_ADDRESS", language)}
                  placeholder={Trans("STREET_ADDRESS", language)}
                  className="form-control"
                  {...register(`street_address`, {
                    required: Trans("STREET_ADDRESS_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage errors={errors} name={`street_address`} />
                </span>
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="CITY"
                  label={Trans("CITY", language)}
                  placeholder={Trans("CITY", language)}
                  className="form-control"
                  {...register(`city`, {
                    required: Trans("CITY_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage errors={errors} name={`city`} />
                </span>
              </FormGroup>
            </Col>
            <Col col={3}>
              <FormGroup mb="20px">
                <Input
                  id="STATE"
                  label={Trans("STATE", language)}
                  placeholder={Trans("STATE", language)}
                  className="form-control"
                  {...register(`state`, {
                    required: Trans("STATE_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage errors={errors} name={`state`} />
                </span>
              </FormGroup>
            </Col>
            <Col col={3}>
              <FormGroup mb="20px">
                <Label
                  display="block"
                  mb="5px"
                  htmlFor={Trans("COUNTRY", language)}
                >
                  {Trans("COUNTRY", language)}
                </Label>
                <select
                  id={Trans("COUNTRY", language)}
                  placeholder={Trans("COUNTRY", language)}
                  className="form-control"
                  {...register(`countries_id`, {
                    required: Trans("COUNTRY_REQUIRED", language),
                  })}
                >
                  <option value={0}>{Trans("SELECT_COUNTRY", language)}</option>
                  {country &&
                    country.map((curr) => (
                      <option value={curr.countries_id} key={curr.countries_id}>
                        {curr.countries_name}
                      </option>
                    ))}
                </select>

                <span className="required">
                  <ErrorMessage errors={errors} name={`countries_id`} />
                </span>
              </FormGroup>
            </Col>

            <Col col={3}>
              <FormGroup mb="20px">
                <Input
                  id="ZIPCODE"
                  label={Trans("ZIPCODE", language)}
                  placeholder={Trans("ZIPCODE", language)}
                  className="form-control"
                  {...register(`zipcode`, {
                    required: Trans("ZIPCODE_REQUIRED", language),
                  })}
                  type="number"
                />
                <span className="required">
                  <ErrorMessage errors={errors} name={`zipcode`} />
                </span>
              </FormGroup>
            </Col>
            <Col col={3}>
              <FormGroup mb="20px">
                <Input
                  id="PHONE"
                  label={Trans("PHONE", language)}
                  placeholder={Trans("PHONE", language)}
                  className="form-control"
                  {...register(`phone`, {
                    required: Trans("PHONE_REQUIRED", language),
                  })}
                  type="number"
                />
                <span className="required">
                  <ErrorMessage errors={errors} name={`phone`} />
                </span>
              </FormGroup>
            </Col>
          </Row>
        )}
        <Row>
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

export default AddAddressContact;
