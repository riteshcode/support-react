import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { subscriptionUpdateUrl, subscriptionEditUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  StatusSelect,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import Loading from "component/Preloader";

const Edit = (props) => {
  console.log("edit props");
  console.log(props);

  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const { editData } = props;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    console.log(saveFormData);
    POST(subscriptionUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          console.log(props);
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
            errObj.msg = Trans(message, language);
          }
          setError(errObj);
        }
      })
      .catch((error) => {
        console.log(error);
        setError({
          status: true,
          msg: error.message,
          type: "danger",
        });
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    function setValueToField() {
      const editInfo = {
        api_token: apiToken,
        subscription_id: editData,
      };
      POST(subscriptionEditUrl, editInfo)
        .then((response) => {
          SetloadingStatus(false);
          const { data } = response.data;
          const fieldList = getValues();
          for (const key in fieldList) {
            console.log(key, data[key]);
            setValue(key, data[key]);
          }
        })
        .catch((error) => {
          console.log(error);
          SetloadingStatus(false);
          alert(error.message);
        });
    }
    setValueToField();
    return () => {
      // setValueToField();
      abortController.abort();
    };
  }, []);

  return (
    <>
      {contentloadingStatus ? (
        <Loading />
      ) : (
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
            <input type="hidden" {...register("subscription_id")} />
            <Row>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    id="SubscriptionExpireDate"
                    type="date"
                    label={Trans("SUBS_EXP_DATE", language)}
                    placeholder="Enter.."
                    hint="Enter text" // for bottom hint
                    className="form-control"
                    {...register("expired_at", {
                      required: "is required",
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup mb="20px">
                  <label htmlFor="status">
                    <b>{Trans("STATUS", language)}</b>
                  </label>
                  <select
                    {...register("status")}
                    className="form-control"
                    id="status"
                  >
                    <option value="">{Trans("SELECT_STATUS", language)}</option>
                    <option value="0">{Trans("INACTIVE", language)}</option>
                    <option value="1">{Trans("ACTIVE", language)} </option>
                    <option value="2">{Trans("LIMITED", language)} </option>
                    <option value="3">{Trans("BLOCKED", language)} </option>
                  </select>
                </FormGroup>
              </Col>
              <Col col={12}>
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("UPDATE", language)}
                  className="btn btn-primary btn-block"
                />
              </Col>
            </Row>
          </form>
        </>
      )}
    </>
  );
};

export default Edit;
