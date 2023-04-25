import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  createUserUrl,
  departmentAllUrl,
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

const Create = ({ ...props }) => {
  console.log(props);
  const { apiToken, language, userType } = useSelector((state) => state.login);
  const [msgType, setMsgType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [departmentList, SetDepartmentList] = useState([]);
  const [designationList, SetDesignationList] = useState([]);

  const { register, handleSubmit } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    console.log(saveFormData);

    POST(createUserUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
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

  useEffect(() => {
    let abortController = new AbortController();

    function getDepartment() {
      const filterData = { api_token: apiToken };
      POST(departmentAllUrl, filterData)
        .then((response) => {
          console.log("response", response);
          const { status, data, message } = response.data;
          if (status) SetDepartmentList(data);
          else Notify(false, Trans(message, language));
        })
        .catch((error) => {
          Notify(false, error.message);
          console.error("There was an error!", error);
        });
      POST(designationAllUrl, filterData)
        .then((response) => {
          console.log("response", response);
          const { status, data, message } = response.data;
          if (status) SetDesignationList(data);
          else Notify(false, Trans(message, language));
        })
        .catch((error) => {
          Notify(false, error.message);
          console.error("There was an error!", error);
        });
    }
    getDepartment();
    return () => {
      abortController.abort();
    };
  }, [apiToken]);

  return (
    <>
      {msgType.length > 2 &&
        (msgType === "success" ? (
          <Alert type="success">{errorMsg}</Alert>
        ) : (
          <Alert type="danger">{errorMsg}</Alert>
        ))}
      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input
          type="hidden"
          {...register("userType")}
          defaultValue={userType}
        />
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
                {...register("password", {
                  required: Trans("PASSWORD_REQUIRED", language),
                  minLength: {
                    value: 6,
                    message: Trans("MIN_PASSWORD_6", language),
                  },
                })}
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
              btnName={Trans("CREATE", language)}
              className="btn btn-primary btn-block"
            />
          </Col>
        </Row>
      </form>
    </>
  );
};

export default Create;
