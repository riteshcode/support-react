import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  LoaderButton,
  FormGroup,
  Col,
  Input,
} from "component/UIElement/UIElement";
import { Trans } from "lang";
import { SettingUrl, storeSettingUrl, languageUrl, countryUrl } from "config";
import POST from "axios/post";
import Notify from "component/Notify";
import { updateLangState } from "redux/slice/loginSlice";

function EmailSetting() {
  const dispatch = useDispatch();
  // const [dataList, SetdataList] = useState([]);
  // const [countryList, SetcountryList] = useState([]);
  const { apiToken, language } = useSelector((state) => state.login);
  const { register, setValue, handleSubmit, getValues } = useForm();
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const getSettingInfo = () => {
    const formData = {
      api_token: apiToken,
    };
    POST(SettingUrl, formData)
      .then((response) => {
        const { data } = response.data;
        if (data !== null) {
          const fieldList = getValues();
          for (const property in fieldList) {
            setValue(property, data[property]);
          }
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    POST(languageUrl, formData)
      .then((response) => {
        const { status, message } = response.data;
        if (status) {
          // SetloadingStatus(false);
          // SetdataList(data.data);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    POST(countryUrl, formData)
      .then((response) => {
        const { status, message } = response.data;
        if (status) {
          // SetloadingStatus(false);
          // SetcountryList(data.data);
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
    <div className="card">
      <div className="card-header">
        <h5>{Trans("EMAIL_SETTING", language)}</h5>
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
                  id="Default Mail driver"
                  type="text"
                  label={Trans("default_mail_driver", language)}
                  placeholder="Enter.."
                  hint="Enter text" // for bottom hint
                  className="form-control"
                  {...register("default_mail_driver", {
                    required: "Default Mail driver is required",
                  })}
                />
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="host_server"
                  type="text"
                  label={Trans("smtp_host_server", language)}
                  placeholder="Enter.."
                  hint="Enter text" // for bottom hint
                  className="form-control"
                  {...register("smtp_host_server", {
                    required: "Host server is required",
                  })}
                />
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="port"
                  type="text"
                  label={Trans("smtp_port", language)}
                  placeholder="Enter.."
                  hint="Enter text" // for bottom hint
                  className="form-control"
                  {...register("smtp_port", {
                    required: "port is required",
                  })}
                />
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="username"
                  type="text"
                  label={Trans("smtp_username", language)}
                  placeholder="Enter.."
                  hint="Enter text" // for bottom hint
                  className="form-control"
                  {...register("smtp_username", {
                    required: "username is required",
                  })}
                />
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="password"
                  type="text"
                  label={Trans("smtp_password", language)}
                  placeholder="Enter.."
                  hint="Enter text" // for bottom hint
                  className="form-control"
                  {...register("smtp_password", {
                    required: "password is required",
                  })}
                />
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="Encryption"
                  type="text"
                  label={Trans("smtp_encryption", language)}
                  placeholder="Enter.."
                  hint="Enter text" // for bottom hint
                  className="form-control"
                  {...register("smtp_encryption", {
                    required: "Encryption is required",
                  })}
                />
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="From Email"
                  type="text"
                  label={Trans("smtp_from_email", language)}
                  placeholder="Enter.."
                  hint="Enter text" // for bottom hint
                  className="form-control"
                  {...register("smtp_from_email", {
                    required: "From Email is required",
                  })}
                />
              </FormGroup>
            </Col>
            <Col col={4}>
              <FormGroup mb="20px">
                <Input
                  id="From Name"
                  type="text"
                  label={Trans("smtp_from_name", language)}
                  placeholder="Enter.."
                  hint="Enter text" // for bottom hint
                  className="form-control"
                  {...register("smtp_from_name", {
                    required: "From Name is required",
                  })}
                />
              </FormGroup>
            </Col>
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

export default EmailSetting;
