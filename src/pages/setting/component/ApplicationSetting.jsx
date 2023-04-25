import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  LoaderButton,
  Col,
  Row,
  Input,
  FormGroup,
  Label,
} from "component/UIElement/UIElement";
import { Trans } from "lang";
import { SettingUrl, storeSettingUrl, languageUrl, countryUrl } from "config";
import POST from "axios/post";
import Notify from "component/Notify";
import { updateLangState } from "redux/slice/loginSlice";

function ApplicationSetting() {
  const dispatch = useDispatch();
  const [dataList, SetdataList] = useState([]);
  // const [countryList, SetcountryList] = useState([]);
  const { apiToken, language } = useSelector((state) => state.login);
  const { register, setValue, getValues, handleSubmit } = useForm();
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const getSettingInfo = () => {
    const formData = {
      api_token: apiToken,
    };

    POST(languageUrl, formData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetdataList(data.data);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    POST(countryUrl, formData)
      .then((response) => {
        const { status, message } = response.data;
        if (status) {
          // SetcountryList(data.data);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    POST(SettingUrl, formData)
      .then((response) => {
        const { data } = response.data;
        if (data !== null) {
          // removing token from object
          console.log(formData);
          const fieldList = getValues();

          for (const property in fieldList) {
            // console.log(`${property}: ${data[property]}`);
            setValue(property, data[property]);
          }
        }
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
        SetformloadingStatus(false);
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
    <div className="card">
      <div className="card-header">
        <h5>{Trans("APPLICATION_SETTING", language)}</h5>
      </div>
      <div className="card-body">
        <form
          action="#"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          noValidate
        >
          <div className="row">
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="Business_name"
                  type="text"
                  label={Trans("Business name", language)}
                  placeholder="Enter.."
                  className="form-control"
                  {...register("business_name", {
                    required: "Business name is required",
                  })}
                />
              </FormGroup>
            </Col>
            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor="default_language">
                  {Trans("DEFAULT_ssLANG", language)}
                </Label>
                <select
                  id="default_language"
                  className="form-control"
                  {...register("default_language", {
                    required: "Language is required",
                  })}
                >
                  <option value="1">Select Language</option>
                  {dataList &&
                    dataList.map((data, index) => {
                      return (
                        <option key={index} value={data.code}>
                          {data.name}
                        </option>
                      );
                    })}
                </select>
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor="Application color">
                  {Trans("Application color", language)}
                </Label>
                <select
                  id="default_language"
                  className="form-control"
                  {...register("application_color", {
                    required: "Application color Name is required",
                  })}
                >
                  <option value="">Select Theme</option>
                  <option value="1">Light</option>
                  <option value="2">Dark</option>
                </select>
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup mb="20px">
                <Label htmlFor="default_item_per_page">
                  {Trans("Default item per page", language)}
                </Label>
                <select
                  id="default_item_per_page"
                  className="form-control"
                  {...register("default_item_per_page", {
                    required: "Default item per is required",
                  })}
                >
                  <option value="10">10</option>
                  <option value="50">50</option>
                </select>
              </FormGroup>
            </div>
          </div>
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
  );
}

export default ApplicationSetting;
