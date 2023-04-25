import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  UserUpdateUserUrl,
  editUserUrl,
  designationAllUrl,
} from "config/index";
import { useSelector } from "react-redux";
import RoleOptions from "component/RoleOptions";
import { Trans } from "lang";
import {
  Row,
  Col,
  LoaderButton,
  FormGroup,
  Label,
  TextArea,
} from "component/UIElement/UIElement";
import Alert from "component/UIElement/Alert";
import Notify from "component/Notify";

const Edit = (props) => {
  const { editData } = props;

  const { apiToken, language } = useSelector((state) => state.login);
  const [msgType, setMsgType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    console.log(saveFormData);
    saveFormData.api_token = apiToken;

    POST(UserUpdateUserUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          props.filterItem("refresh", "", "");
          setMsgType("success");
          document.querySelector("form").reset();
          setErrorMsg(Trans(message, language));
          Notify(true, Trans(message, language));
          props.handleModalClose();
        } else {
          setMsgType("danger");
          if (typeof message === "object") {
            let errMsg = "";
            Object.keys(message).map((key) => {
              errMsg += Trans(message[key][0], language);
              return errMsg;
            });
            setErrorMsg(errMsg);
          } else {
            setErrorMsg(Trans(message, language));
          }
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
        setMsgType("danger");
        SetformloadingStatus(false);
        setErrorMsg("Something went wrong !");
      });
  };
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  useEffect(() => {
    let abortController = new AbortController();

    const setValueToField = () => {
      const editInfo = {
        api_token: apiToken,
        user_id: editData,
      };
      POST(editUserUrl, editInfo)
        .then((response) => {
          SetloadingStatus(false);
          const { data } = response.data;
          console.log("data", data);
          setValue("name", data.first_name);
          setValue("email", data.email);
          setValue("user_id", data.id);
          let role_id = data?.roles[0]["roles_id"];
          setValue("role_name", role_id);
        })
        .catch((error) => {
          SetloadingStatus(false);
          Notify(false, error.message);
        });
    };
    setValueToField();

    return () => {
      abortController.abort();
    };
  }, [apiToken]);

  return (
    <React.Fragment>
      {msgType.length > 2 &&
        (msgType === "success" ? (
          <Alert type="success">{errorMsg}</Alert>
        ) : (
          <Alert type="danger">{errorMsg}</Alert>
        ))}
      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="hidden" {...register("user_id")} />

        <Row>
          <Col col={12}>
            <FormGroup>
              <Label display="block" mb="5px" htmlFor="name">
                {Trans("NAME", language)} <span className="required">*</span>
              </Label>
              <input
                id="name"
                type="text"
                placeholder={Trans("NAME", language)}
                className="form-control"
                {...register("name", {
                  required: Trans("NAME_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup>
              <Label display="block" mb="5px" htmlFor="email">
                {Trans("EMAIL", language)} <span className="required">*</span>
              </Label>
              <input
                id="email"
                type="email"
                className="form-control"
                readOnly
                placeholder={Trans("EMAIL", language)}
                {...register("email", {
                  required: Trans("EMAIL", language),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: Trans("INVALID_EMAIL_ADDRESS", language),
                  },
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup>
              <Label display="block" mb="5px" htmlFor="password">
                {Trans("PASSWORD", language)}{" "}
                <span className="required">*</span>
              </Label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder={Trans("PASSWORD", language)}
                {...register("password")}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup>
              <Label display="block" mb="5px" htmlFor="role_name">
                {Trans("ROLE", language)} <span className="required">*</span>
              </Label>
              <select
                id="role_name"
                className="form-control"
                {...register("role_name", {
                  required: Trans("ROLE_REQUIRED", language),
                })}
              >
                <RoleOptions />
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
    </React.Fragment>
  );
};

export default Edit;
