import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { LoaderButton, FormGroup, Label } from "component/UIElement/UIElement";
import { Trans } from "lang";
import {
  generalSettingFirstUrl,
  generalSettingUrl,
  languageUrl,
  countryUrl,
} from "config";
import POST from "axios/post";
import Notify from "component/Notify";
import { updateLangState } from "redux/slice/loginSlice";

function GeneralSetting() {
  const dispatch = useDispatch();
  const [dataList, SetdataList] = useState([]);
  const [countryList, SetcountryList] = useState([]);
  const { apiToken, language } = useSelector((state) => state.login);
  const { register, setValue, handleSubmit } = useForm();
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const getSettingInfo = () => {
    const formData = {
      api_token: apiToken,
    };
    POST(generalSettingFirstUrl, formData)
      .then((response) => {
        const { data } = response.data;
        if (data !== null) {
          setValue("default_language", data.default_language);
          setValue("currency", data.currency);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    POST(languageUrl, formData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetdataList(data.data);
          SetPagi(data.total_page);
          SetcurrPage(data.current_page);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    POST(countryUrl, formData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetcountryList(data.data);
          SetPagi(data.total_page);
          SetcurrPage(data.current_page);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(generalSettingUrl, saveFormData)
      .then((response) => {
        const { status, message } = response.data;
        if (status) {
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
    <div className="card">
      <div className="card-header">
        <h5>{Trans("G_SETTING", language)}</h5>
      </div>
      <div className="card-body">
        <form
          action="#"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          noValidate
        >
          <div className="row">
            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor="default_language">
                  {Trans("DEFAULT_LANG", language)}
                </Label>
                <select
                  id="default_language"
                  className="form-control"
                  {...register("default_language", {
                    required: "Language is required",
                  })}
                >
                  {dataList &&
                    dataList.map((data) => {
                      return <option value={data.code}>{data.name}</option>;
                    })}
                </select>
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup>
                <Label htmlFor="country">
                  {Trans("COUNTRY_NAME", language)}
                </Label>
                <select
                  id="default_language"
                  className="form-control"
                  {...register("country", {
                    required: "Country Name is required",
                  })}
                >
                  {countryList &&
                    countryList.map((data) => {
                      return <option value={data.sortname}>{data.name}</option>;
                    })}
                </select>
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup mb="20px">
                <Label htmlFor="currency">{Trans("CURRENCY", language)}</Label>
                <select
                  id="currency"
                  className="form-control"
                  {...register("currency", {
                    required: "Currency is required",
                  })}
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
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

export default GeneralSetting;
