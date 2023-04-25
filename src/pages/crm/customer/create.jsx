import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm, FormProvider } from "react-hook-form";
import { customerStoreUrl, leadCreateUrl } from "config/index";
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
import MultipleContact from "./component/MultipleContact";
import MultipleAddress from "./component/MultipleAddress";

const Create = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { source, country } = props;
  const methods = useForm({
    defaultValues: {
      contactAdd: [{ contact_name: "", contact_email: "" }],
      mulAddress: [
        {
          address_type: "",
          street_address: "",
          city: "",
          state: "",
          zipcode: "",
          countries_id: "",
          phone: "",
        },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(customerStoreUrl, saveFormData)
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
      <FormProvider {...methods}>
        <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Row>
            <Col col={4}>
              <FormGroup mb="20px">
                <Label
                  display="block"
                  mb="5px"
                  htmlFor={Trans("LEAD_ID", language)}
                >
                  {Trans("LEAD_ID", language)}
                </Label>
                <select
                  id={Trans("LEAD_ID", language)}
                  placeholder={Trans("LEAD_ID", language)}
                  className="form-control"
                  {...register("lead_id", {
                    required: Trans("LEAD_ID_REQUIRED", language),
                  })}
                >
                  <option value="">{Trans("SELECT_LEAD", language)}</option>
                  {source &&
                    source.map((curr) => (
                      <option value={curr.lead_id} key={curr.lead_id}>
                        {curr.company_name}
                      </option>
                    ))}
                </select>

                <span className="required">
                  <ErrorMessage errors={errors} name="lead_id" />
                </span>
              </FormGroup>
            </Col>

            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="COMPANY_NAME"
                  label={Trans("COMPANY_NAME", language)}
                  placeholder={Trans("COMPANY_NAME", language)}
                  className="form-control"
                  {...register("company_name", {
                    required: Trans("COMPANY_NAME_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage errors={errors} name="company_name" />
                </span>
              </FormGroup>
            </Col>

            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="WEBSITE"
                  label={Trans("WEBSITE", language)}
                  placeholder={Trans("WEBSITE", language)}
                  className="form-control"
                  {...register("website", {
                    required: Trans("WEBSITE_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage errors={errors} name="website" />
                </span>
              </FormGroup>
            </Col>
            <Col col={12}>
              <MultipleContact />
            </Col>
            <Col col={12}>
              <MultipleAddress country={country} />
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
      </FormProvider>
    </>
  );
};

export default Create;
