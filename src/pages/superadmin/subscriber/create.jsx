import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { subscriberStoreUrl, CountryCreateList } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import { ErrorMessage } from "@hookform/error-message";

import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  TextArea,
  StatusSelect,
  IsFeatured,
  Label,
} from "component/UIElement/UIElement";
import Select from "react-select";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";

const Create = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [moduleList, SetmoduleList] = useState([]);

  const { register, handleSubmit,setValue, formState: { errors }, } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    // saveFormData.industry_id = MultiSelectItem;

    POST(subscriberStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
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
        SetformloadingStatus(false);
        setError({
          status: true,
          msg: error.message,
          type: "danger",
        });
      });
  };

  const getModuleList = () => {
    const filterData2 = {
      api_token: apiToken,
    };
    POST(CountryCreateList, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetmoduleList(data.country_list);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getModuleList();
    return () => abortController.abort(); //getModuleList();
  }, []);

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
                id={Trans("BUSINESS_NAME", language)}
                label={Trans("BUSINESS_NAME", language)}
                placeholder={Trans("BUSINESS_NAME", language)}
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("business_name", {
                  required: Trans("BUSINESS_NAME_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BUSINESS_EMAIL", language)}
                label={Trans("BUSINESS_EMAIL", language)}
                placeholder={Trans("BUSINESS_EMAIL", language)}
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("business_email", {
                  required: Trans("BUSINESS_EMAIL_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BILLING_NAME", language)}
                label={Trans("BILLING_NAME", language)}
                placeholder={Trans("BILLING_NAME", language)}
                className="form-control"
                {...register("billing_contact_name", {
                  required: Trans("BILLING_NAME_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BILLING_EMAIL", language)}
                label={Trans("BILLING_EMAIL", language)}
                placeholder={Trans("BILLING_EMAIL", language)}
                className="form-control"
                {...register("billing_email", {
                  required: Trans("BILLING_EMAIL_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BILLING_ADDRESS", language)}
                label={Trans("BILLING_ADDRESS", language)}
                placeholder={Trans("BILLING_ADDRESS", language)}
                className="form-control"
                {...register("billing_street_address", {
                  required: Trans("BILLING_ADDRESS_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BILLING_CITY", language)}
                label={Trans("BILLING_CITY", language)}
                placeholder={Trans("BILLING_CITY", language)}
                className="form-control"
                {...register("billing_city", {
                  required: Trans("BILLING_CITY_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BILLING_STATE", language)}
                label={Trans("BILLING_STATE", language)}
                placeholder={Trans("BILLING_STATE", language)}
                className="form-control"
                {...register("billing_state", {
                  required: Trans("BILLING_STATE_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
          <FormGroup mb="20px">
              <Input
                type="hidden"
                id={Trans("BILLING_COUNTRY", language)}
                label={Trans("BILLING_COUNTRY", language)}
                placeholder={Trans("BILLING_COUNTRY", language)}
                className="form-control"
                {...register("billing_country", {
                  required: Trans("CHOOSE_COUNTRY_REQUIRED", language),
                })}
              />

              <Select
                isMulti
                name={Trans("BILLING_COUNTRY", language)}
                options={moduleList}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(newValue, actionMeta) => {
                  let listArr = [];
                  for (let index = 0; index < newValue.length; index++)
                    listArr[index] = newValue[index].value;

                  listArr = listArr.join(",");
                  console.log("listArr", listArr);
                  setValue("billing_country", listArr);
                }}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="billing_country" />
              </span>
            </FormGroup>
          </Col>
          
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BILLING_ZIP_CODE", language)}
                label={Trans("BILLING_ZIP_CODE", language)}
                placeholder={Trans("BILLING_ZIP_CODE", language)}
                className="form-control"
                {...register("billing_zipcode", {
                  required: Trans("BILLING_ZIP_CODE_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BILLING_PHONE", language)}
                label={Trans("BILLING_PHONE", language)}
                placeholder={Trans("BILLING_PHONE", language)}
                className="form-control"
                {...register("billing_phone", {
                  required: Trans("BILLING_PHONE_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BILLING_GST", language)}
                label={Trans("BILLING_GST", language)}
                placeholder={Trans("BILLING_GST", language)}
                className="form-control"
                {...register("billing_gst", {
                  required: Trans("BILLING_GST_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>

          <Col col={6}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("BILLING_DEFAULT", language)}
              >
                {Trans("BILLING_DEFAULT", language)}
              </Label>
              <select
                {...register("billing_default", {
                  required: Trans("BILLING_DEFAULT_REQUIRED", language),
                })}
                className="form-control"
              >
                <option value="">{Trans("SELECT_BILLING_DEFAULT")}</option>
                <option value={0}>{Trans("NO")}</option>
                <option value={1}>{Trans("YES")}</option>
              </select>
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
