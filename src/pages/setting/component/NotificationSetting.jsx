import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { LoaderButton, FormGroup, Radio } from "component/UIElement/UIElement";
import { Trans } from "lang";
import { notificationSettingUrl, notificationSettingFirstUrl } from "config";
import POST from "axios/post";
import Notify from "component/Notify";

function NotificationSetting() {
  const { apiToken, language } = useSelector((state) => state.login);
  const { register, setValue, handleSubmit } = useForm();
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const getSettingInfo = () => {
    const formData = {
      api_token: apiToken,
    };
    POST(notificationSettingFirstUrl, formData)
      .then((response) => {
        console.log(response);
        const { data } = response.data;
        console.log(data);
        if (data !== null) {
          setValue("order_noti_status", data.order_noti_status);
          setValue("order_noti_type", data.order_noti_type);
          setValue("user_noti_status", data.user_noti_status);
          setValue("user_noti_type", data.user_noti_type);
          setValue("newsletter_noti_status", data.newsletter_noti_status);
          setValue("newsletter_noti_type", data.newsletter_noti_type);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    console.log(formData);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    console.log(saveFormData);
    POST(notificationSettingUrl, saveFormData)
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
    getSettingInfo();
    return () => {
      getSettingInfo();
    };
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h5>{Trans("NOTI_SETTING", language)}</h5>
      </div>
      <div className="card-body">
        <form
          action="#"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          noValidate
        >
          <div className="row">
            <div className="col-md-3">
              <div className="st-bg">
                <b>
                  {Trans(`order_NOTI`, language)}
                  &nbsp;:
                </b>
              </div>
            </div>
            <div className="col-md-3">
              <FormGroup mb="20px">
                <select
                  className="form-control"
                  id="order_noti_status"
                  {...register("order_noti_status")}
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                </select>
              </FormGroup>
            </div>
            <div className="col-md-5">
              <div className="row">
                <div className="col-md-4">
                  <div className="st-bg">
                    <Radio
                      id="order_email"
                      label=" Email"
                      value="email"
                      name="order_noti_type"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="st-bg">
                    <Radio
                      id="order_sms"
                      label=" Sms"
                      value="sms"
                      refs={React.forwardRef()}
                      {...register("order_noti_type")}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="st-bg">
                    <Radio
                      id="order_both"
                      label="Both"
                      value="both"
                      refs={React.forwardRef()}
                      {...register("order_noti_type")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="st-bg">
                <b>
                  {Trans(`user_NOTI`, language)}
                  &nbsp;:
                </b>
              </div>
            </div>
            <div className="col-md-3">
              <FormGroup mb="20px">
                <select
                  className="form-control"
                  id="user_noti_status"
                  {...register("user_noti_status")}
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                </select>
              </FormGroup>
            </div>
            <div className="col-md-5">
              <div className="row">
                <div className="col-md-4">
                  <div className="st-bg">
                    <Radio
                      id="user_email"
                      label=" Email"
                      value="email"
                      {...register("user_noti_type")}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="st-bg">
                    <Radio
                      id="user_sms"
                      label=" Sms"
                      value="sms"
                      {...register("user_noti_type")}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="st-bg">
                    <Radio
                      id="user_both"
                      label="Both"
                      value="both"
                      {...register("user_noti_type")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="st-bg">
                <b>
                  {Trans(`newsletter_NOTI`, language)}
                  &nbsp;:
                </b>
              </div>
            </div>
            <div className="col-md-3">
              <FormGroup mb="20px">
                <select
                  className="form-control"
                  id="newsletter_noti_status"
                  {...register("newsletter_noti_status")}
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                </select>
              </FormGroup>
            </div>
            <div className="col-md-5">
              <div className="row">
                <div className="col-md-4">
                  <div className="st-bg">
                    <Radio
                      id="newsletter_email"
                      label=" Email"
                      value="email"
                      {...register("newsletter_noti_type")}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="st-bg">
                    <Radio
                      id="newsletter_sms"
                      label=" Sms"
                      value="sms"
                      {...register("newsletter_noti_type")}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="st-bg">
                    <Radio
                      id="newsletter_both"
                      label="Both"
                      value="both"
                      {...register("newsletter_noti_type")}
                    />
                  </div>
                </div>
              </div>
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

export default NotificationSetting;
