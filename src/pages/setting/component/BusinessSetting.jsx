import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  LoaderButton,
  Row,
  Input,
  Col,
  FormGroup,
  Label,
} from "component/UIElement/UIElement";
import { Trans } from "lang";
import { SettingUrl, storeSettingUrl } from "config";
import POST from "axios/post";
import Notify from "component/Notify";
import { updateLangState } from "redux/slice/loginSlice";
// import Loading from "component/Preloader";

function BusinessSetting() {
  const dispatch = useDispatch();
  const { apiToken, language } = useSelector((state) => state.login);
  const { register, setValue, getValues, handleSubmit } = useForm();
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  // const [contentloadingStatus, SetloadingStatus] = useState(true);

  const getSettingInfo = () => {
    const formData = {
      api_token: apiToken,
    };
    POST(SettingUrl, formData)
      .then((response) => {
        const { data } = response.data;
        if (data !== null) {
          // show selected value from url
          const fieldList = getValues();
          for (const property in fieldList) {
            setValue(property, data[property]);
          }
        }
        // SetloadingStatus(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(storeSettingUrl, saveFormData)
      .then((response) => {
        const { status, message } = response.data;
        if (status) {
          getSettingInfo();
          dispatch(updateLangState(formData.default_language));
          Notify(true, message);
          SetformloadingStatus(false);
        } else {
          if (typeof message === "object") {
            let errMsg = "";
            Object.keys(message).map((key) => {
              errMsg += message[key][0];
              return errMsg;
            });
            Notify(false, errMsg);
          } else {
            Notify(false, message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        Notify(true, error.message);
      });
  };
  useEffect(() => {
    getSettingInfo();
    return () => {
      getSettingInfo();
    };
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h5>{Trans("BUSINESS_SETTING", language)}</h5>
        </div>
        <div className="card-body">
          <form
            action="#"
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            noValidate
          >
            <Row>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Input
                    id="Business_name"
                    type="text"
                    label={Trans("Business name", language)}
                    placeholder="Enter.."
                    hint="Enter text" // for bottom hint
                    className="form-control"
                    {...register("business_name", {
                      required: "Business name is required",
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Input
                    id="start_date"
                    type="text"
                    label={Trans("START_DATE", language)}
                    placeholder="Enter.."
                    hint="Enter text" // for bottom hint
                    className="form-control"
                    {...register("business_start_date", {
                      required: "Start Date is required",
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Input
                    id="timezone"
                    type="text"
                    label={Trans("TIMEZONE", language)}
                    placeholder="Enter.."
                    hint="Enter text" // for bottom hint
                    className="form-control"
                    {...register("business_timezone", {
                      required: "Start Date is required",
                    })}
                  />
                </FormGroup>
              </Col>

              <Col col={4}>
                <FormGroup mb="20px">
                  <Label htmlFor="currency">
                    {Trans("CURRENCY", language)}
                  </Label>
                  <select
                    id="currency"
                    className="form-control"
                    {...register("business_currency", {
                      required: "Currency is required",
                    })}
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                  </select>
                </FormGroup>
              </Col>

              <Col col={4}>
                <FormGroup mb="20px">
                  <Label htmlFor="currency symbol placement">
                    {Trans("Currency symbol placement", language)}
                  </Label>
                  <select
                    id="currency symbol placement"
                    className="form-control"
                    {...register("business_currency_symbol_placement", {
                      required: "Currency symbol placement is required",
                    })}
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                  </select>
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Input
                    id="profit_ercentage"
                    type="text"
                    label={Trans("PROFIT_PERCENTAGE", language)}
                    placeholder="Enter.."
                    hint="Enter text" // for bottom hint
                    className="form-control"
                    {...register("business_profit_percentage", {
                      required: "Profit ercentage is required",
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup>
                  <Label htmlFor="Financial start month">
                    {Trans("Financial start month", language)}
                  </Label>
                  <select
                    id="Financial start month"
                    className="form-control"
                    {...register("business_financial_start_month", {
                      required: "Financial start month is required",
                    })}
                  >
                    <option value="1">Jan</option>
                    <option value="2">Feb</option>
                  </select>
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Label htmlFor="Date format">
                    {Trans("Date format", language)}
                  </Label>
                  <select
                    id="Date format"
                    className="form-control"
                    {...register("business_date_format", {
                      required: "Date format is required",
                    })}
                  >
                    <option value="1">Jan</option>
                    <option value="2">Feb</option>
                  </select>
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Label htmlFor="Time Format">
                    {Trans("Time Format", language)}
                  </Label>
                  <select
                    id="Time Format"
                    className="form-control"
                    {...register("business_time_format", {
                      required: "Time Format is required",
                    })}
                  >
                    <option value="1">Jan</option>
                    <option value="2">Feb</option>
                  </select>
                </FormGroup>
              </Col>
            </Row>
            <div className="row">
              <div className="col-md-4">
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("UPDATE", language)}
                  className="btn btn-primary form-control"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default BusinessSetting;
