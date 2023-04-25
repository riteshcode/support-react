import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { LoaderButton, FormGroup, Label } from "component/UIElement/UIElement";
import { Trans } from "lang";
import { websiteSettingUrl, websiteSettingFirstUrl } from "config";
import POST from "axios/post";
import Notify from "component/Notify";

function WebsiteSetting() {
  const { apiToken, language } = useSelector((state) => state.login);
  const { register, setValue, handleSubmit } = useForm();
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const onSubmit = (formData) => {
    console.log(formData);
    SetformloadingStatus(true);
    // console.log(formData);
    // const saveFormData = formData;
    // saveFormData.api_token = apiToken;
    // console.log(saveFormData);
    let formDatss = new FormData();
    formDatss.append("api_token", apiToken);
    formDatss.append("website_logo", formData.website_logo[0]);
    formDatss.append("website_name", formData.website_name);

    POST(websiteSettingUrl, formDatss)
      .then((response) => {
        console.log(response);
        const { status, message } = response.data;
        if (status) {
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
    const getSettingInfo = () => {
      const formData = {
        api_token: apiToken,
      };
      POST(websiteSettingFirstUrl, formData)
        .then((response) => {
          console.log(response);
          const { data } = response.data;
          console.log(data);
          if (data !== null) {
            setValue("website_name", data.website_name);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    };

    getSettingInfo();
    return () => {
      getSettingInfo();
    };
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h5>{Trans("WEB_SETTING", language)}</h5>
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
              <FormGroup mb="20px">
                <Label htmlFor="website_name">
                  {Trans("WEBSITE_NAME", language)}
                </Label>
                <input
                  id="website_name"
                  type="text"
                  placeholder="Enter website name"
                  className="form-control"
                  {...register("website_name", {
                    required: "Website name is required",
                  })}
                />
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup mb="20px">
                <Label display="block" mb="5px" htmlFor="website_logo">
                  {Trans("WEBSITE_LOGO", language)}
                </Label>
                <input
                  id="website_logo"
                  type="file"
                  placeholder="Enter website logo"
                  className="form-control"
                  {...register("website_logo")}
                />
              </FormGroup>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
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

export default WebsiteSetting;
