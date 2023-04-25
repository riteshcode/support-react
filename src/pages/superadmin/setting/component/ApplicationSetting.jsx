import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  LoaderButton,
  FormGroup,
  Label,
  Col,
  Input,
} from "component/UIElement/UIElement";
import { Trans } from "lang";
import { SettingUrl, storeSettingUrl, tempUploadFileUrl } from "config";
import POST from "axios/post";
import Notify from "component/Notify";
import { updateLangState } from "redux/slice/loginSlice";

function ApplicationSetting() {
  const dispatch = useDispatch();
  const [langList, SetLangList] = useState([]);
  const [currencyList, SetCurrencyList] = useState([]);
  const [timezoneList, SetTimezoneList] = useState([]);
  const { apiToken, language } = useSelector((state) => state.login);
  const { register, setValue, getValues, handleSubmit } = useForm();
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const getSettingInfo = () => {
    const formData = {
      api_token: apiToken,
    };

    POST(SettingUrl, formData)
      .then((response) => {
        const { data } = response.data;
        console.log("data", data);
        if (data !== null) {
          const { settingInfo, currency, language, timezone } = data;
          SetLangList(language);
          SetCurrencyList(currency);
          SetTimezoneList(timezone);

          const fieldList = getValues();
          for (const property in fieldList) {
            setValue(property, settingInfo[property]);
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
          // getSettingInfo();
          // dispatch(updateLangState(formData.default_language));
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
        Notify(false, error.message);
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getSettingInfo();
    return () => abortController.abort();
  }, []);

  const HandleDocumentUpload = (event, previewUrlId, StoreID) => {
    console.log("event.target.files[0].type", event.target.files[0].type);
    if (event.target.files[0] === "" || event.target.files[0] === undefined) {
      Notify(false, Trans("IMAGE_NOT_CHOOSEN", language));
      return;
    }

    // if (
    //   event.target.files[0].type !== "image/jpeg" ||
    //   event.target.files[0].type !== "image/png"
    // ) {
    //   Notify(false, Trans("CHOOSE_IMAGE_NOT_FILE", language));
    //   return;
    // }

    var readers = new FileReader();
    readers.onload = function (e) {
      console.log("filereade", e);
      document.getElementById(
        previewUrlId
      ).innerHTML = `<a href=${e.target.result} download >Preview</a>`;
    };
    readers.readAsDataURL(event.target.files[0]);

    // upload temp image and bind value to array
    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", event.target.files[0]);
    POST(tempUploadFileUrl, formdata)
      .then((response) => {
        console.log("temp", response);
        setValue(StoreID, response.data.data);
      })
      .catch((error) => {
        Notify(false, error.message);
      });
  };

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
                  id={Trans("APPLICATION_NAME", language)}
                  type="text"
                  label={Trans("APPLICATION_NAME", language)}
                  placeholder={Trans("APPLICATION_NAME", language)}
                  className="form-control"
                  {...register("APP_NAME", {
                    required: Trans("APPLICATION_NAME", language),
                  })}
                />
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id={Trans("APPLICATION_DOMAIN", language)}
                  type="text"
                  label={Trans("APPLICATION_DOMAIN", language)}
                  placeholder={Trans("APPLICATION_DOMAIN", language)}
                  className="form-control"
                  {...register("APP_DOMAIN", {
                    required: Trans("APPLICATION_DOMAIN", language),
                  })}
                />
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup>
                <Label
                  display="block"
                  mb="5px"
                  htmlFor={Trans("APPLICATION_LOGO", language)}
                >
                  {Trans("APPLICATION_LOGO", language)}
                </Label>
                <div className="custom-file">
                  <input type="hidden" {...register("APP_LOGO")} />
                  <input
                    type="file"
                    className="custom-file-input"
                    id={Trans("APPLICATION_LOGO", language)}
                    onChange={(event) =>
                      HandleDocumentUpload(
                        event,
                        "application_logo_pre",
                        "APP_LOGO"
                      )
                    }
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Logo
                  </label>
                  <div id="application_logo_pre"></div>
                </div>
              </FormGroup>
            </Col>

            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor="default_language">
                  {Trans("DEFAULT_LANG", language)}
                </Label>
                <select
                  id="default_language"
                  className="form-control"
                  {...register("APP_DEFAULT_LANGUAGE", {
                    required: "Language is required",
                  })}
                >
                  <option value="">Select Language</option>
                  {langList &&
                    langList.map((data, index) => {
                      return (
                        <option key={index} value={data.languages_code}>
                          {data.languages_name}
                        </option>
                      );
                    })}
                </select>
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor="other_language">
                  {Trans("OTHER_LANG", language)}
                </Label>
                <select
                  id="other_language"
                  className="form-control"
                  {...register("APP_OTHER_LANGUAGE", {
                    required: "Language is required",
                  })}
                >
                  <option value="">Select Language</option>
                  {langList &&
                    langList.map((data, index) => {
                      return (
                        <option key={index} value={data.languages_code}>
                          {data.languages_name}
                        </option>
                      );
                    })}
                </select>
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor={Trans("DEFAULT_CURRENCY", language)}>
                  {Trans("DEFAULT_CURRENCY", language)}
                </Label>
                <select
                  id={Trans("DEFAULT_CURRENCY", language)}
                  className="form-control"
                  {...register("APP_DEFAULT_CURRENCY", {
                    required: "Language is required",
                  })}
                >
                  <option value="">{Trans("SELECT_CURRENCY", language)}</option>
                  {currencyList &&
                    currencyList.map((data, index) => {
                      return (
                        <option key={index} value={data.currencies_id}>
                          {data.currencies_code}
                        </option>
                      );
                    })}
                </select>
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor={Trans("OTHER_CURRENCY", language)}>
                  {Trans("OTHER_CURRENCY", language)}
                </Label>
                <select
                  id={Trans("OTHER_CURRENCY", language)}
                  className="form-control"
                  {...register("APP_OTHER_CURRENCY", {
                    required: "Language is required",
                  })}
                >
                  <option value="">{Trans("SELECT_CURRENCY", language)}</option>
                  {currencyList &&
                    currencyList.map((data, index) => {
                      return (
                        <option key={index} value={data.currencies_id}>
                          {data.currencies_code}
                        </option>
                      );
                    })}
                </select>
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor={Trans("TIMEZONE", language)}>
                  {Trans("TIMEZONE", language)}
                </Label>
                <select
                  id={Trans("TIMEZONE", language)}
                  className="form-control"
                  {...register("APP_TIMEZONE", {
                    required: "Language is required",
                  })}
                >
                  <option value="">{Trans("SELECT_TIMEZONE", language)}</option>
                  {timezoneList &&
                    timezoneList.map((data, index) => {
                      return (
                        <option key={index} value={data.timezone_id}>
                          {data.timezone_location}
                        </option>
                      );
                    })}
                </select>
              </FormGroup>
            </div>
            <Col col={4}>
              <FormGroup mb="20px">
                <Label htmlFor={Trans("DATE_FORMAT", language)}>
                  {Trans("DATE_FORMAT", language)}
                </Label>
                <select
                  id={Trans("DATE_FORMAT", language)}
                  className="form-control"
                  {...register("APP_DATE_FORMAT", {
                    required: Trans("DATE_FORMAT", language),
                  })}
                >
                  <option value="">
                    {Trans("SELECT_DATE_FORMAT", language)}
                  </option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                  <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Label htmlFor={Trans("TIME_FORMAT", language)}>
                  {Trans("TIME_FORMAT", language)}
                </Label>
                <select
                  id={Trans("TIME_FORMAT", language)}
                  className="form-control"
                  {...register("APP_TIME_FORMAT", {
                    required: Trans("TIME_FORMAT", language),
                  })}
                >
                  <option value="">
                    {Trans("SELECT_TIME_FORMAT", language)}
                  </option>
                  <option value="h:i:s">h:i:s</option>
                </select>
              </FormGroup>
            </Col>
            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor={Trans("THEME_COLOR", language)}>
                  {Trans("THEME_COLOR", language)}
                </Label>
                <select
                  id={Trans("THEME_COLOR", language)}
                  className="form-control"
                  {...register("APP_THEME_COLOR", {
                    required: Trans("THEME_COLOR_REQUIRED", language),
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
                  {...register("APP_DEFAULT_ITEM_PER_PAGE", {
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
