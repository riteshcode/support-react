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
                    id={Trans("BUSINESS_NAME", language)}
                    type="text"
                    label={Trans("BUSINESS_NAME", language)}
                    placeholder={Trans("BUSINESS_NAME", language)}
                    className="form-control"
                    {...register("business_name", {
                      required: Trans("BUSINESS_NAME_REQUIRED", language),
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("WEBSITE", language)}
                    type="text"
                    label={Trans("WEBSITE", language)}
                    placeholder={Trans("WEBSITE", language)}
                    className="form-control"
                    {...register("website", {
                      required: Trans("WEBSITE_REQUIRED", language),
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("ESTABLISHED_DATE", language)}
                    type="text"
                    label={Trans("ESTABLISHED_DATE", language)}
                    placeholder={Trans("ESTABLISHED_DATE", language)}
                    className="form-control"
                    {...register("business_establish_date", {
                      required: Trans("ESTABLISHED_DATE_REQUIRED", language),
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("BUSINESS_ADDRESS", language)}
                    type="text"
                    label={Trans("BUSINESS_ADDRESS", language)}
                    placeholder={Trans("BUSINESS_ADDRESS", language)}
                    className="form-control"
                    {...register("business_address", {
                      required: Trans("BUSINESS_ADDRESS_REQUIRED", language),
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("BUSINESS_EMAIL", language)}
                    type="text"
                    label={Trans("BUSINESS_EMAIL", language)}
                    placeholder={Trans("BUSINESS_EMAIL", language)}
                    className="form-control"
                    {...register("business_email", {
                      required: Trans("BUSINESS_EMAIL_REQUIRED", language),
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={4}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("BUSINESS_CONTACT", language)}
                    type="text"
                    label={Trans("BUSINESS_CONTACT", language)}
                    placeholder={Trans("BUSINESS_CONTACT", language)}
                    className="form-control"
                    {...register("business_contact", {
                      required: Trans("BUSINESS_CONTACT_REQUIRED", language),
                    })}
                  />
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
