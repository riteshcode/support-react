import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { createUserUrl, departmentAllUrl } from "config/index";
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
  const { apiToken, language } = useSelector((state) => state.login);
  const [msgType, setMsgType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [departmentList, SetDepartmentList] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    console.log(saveFormData);

    // check validation
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!saveFormData.contact_no.match(phoneno)) {
      SetformloadingStatus(false);
      Notify(false, Trans("Contact number must be 10 digit", language));
      return "";
    }

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
    }
    getDepartment();
    return () => {
      getDepartment();
    };
  }, []);

  return (
    <>
      {msgType.length > 2 &&
        (msgType === "success" ? (
          <Alert type="success">{errorMsg}</Alert>
        ) : (
          <Alert type="danger">{errorMsg}</Alert>
        ))}
      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Row>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="name">
                {Trans("NAME", language)} <span className="required">*</span>
              </Label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="form-control"
                {...register("name", {
                  required: "User Name is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="email">
                {Trans("EMAIL_A", language)} <span className="required">*</span>
              </Label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter your email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "invalid email address",
                  },
                })}
              />
              <span className="hint">Hint:mail@gmail.com</span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="password">
                {Trans("PASSWORD", language)}{" "}
                <span className="required">*</span>
              </Label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum length is 6",
                  },
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="dept_name">
                {Trans("DEPT", language)} <span className="required">*</span>
              </Label>
              <select
                id="dept_name"
                className="form-control"
                {...register("department_id", {
                  required: "Department is required",
                })}
              >
                <option value="">Select Department</option>
                {departmentList &&
                  departmentList.map((dept) => {
                    return (
                      <option
                        key={dept.department_id}
                        value={dept.department_id}
                      >
                        {dept.dept_name}
                      </option>
                    );
                  })}
              </select>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="role_name">
                {Trans("ROLE", language)} <span className="required">*</span>
              </Label>
              <select
                id="role_name"
                className="form-control"
                {...register("role_name", {
                  required: "Role name is required",
                })}
              >
                <RoleOptions />
              </select>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="marital_status">
                {Trans("MARITAL_STATUS", language)}{" "}
                <span className="required">*</span>
              </Label>
              <select
                id="role_name"
                className="form-control"
                {...register("marital_status", {
                  required: "marital_status is required",
                })}
              >
                <option value="">
                  {Trans("SELECT_MARITAL_STATUS", language)}
                </option>
                <option value={1}>{Trans("MARRIED", language)}</option>
                <option value={0}>{Trans("UNMARRIED", language)}</option>
              </select>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="gender">
                {Trans("GENDER", language)} <span className="required">*</span>
              </Label>
              <select
                id="role_name"
                className="form-control"
                {...register("gender", {
                  required: "Gender is required",
                })}
              >
                <option value="">{Trans("SELECT_GENDER", language)}</option>
                <option value={0}>{Trans("MALE", language)}</option>
                <option value={1}>{Trans("FEMALE", language)}</option>
                <option value={2}>{Trans("TRANSGENDER", language)}</option>
              </select>
            </FormGroup>
          </Col>

          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="DATE_OF_BIRTH">
                {Trans("DATE_OF_BIRTH", language)}{" "}
                <span className="required">*</span>
              </Label>
              <input
                id="DATE_OF_BIRTH"
                type="date"
                placeholder="Enter"
                className="form-control"
                {...register("date_of_birth", {
                  required: "Date of birth is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="date_of_joining">
                {Trans("date_of_joining", language)}{" "}
                <span className="required">*</span>
              </Label>
              <input
                id="date_of_joining"
                type="date"
                placeholder="Enter"
                className="form-control"
                {...register("date_of_joining", {
                  required: "Date of birth is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="date_of_leaving">
                {Trans("date_of_leaving", language)}{" "}
                <span className="required">*</span>
              </Label>
              <input
                id="date_of_leaving"
                type="date"
                placeholder="Enter"
                className="form-control"
                {...register("date_of_leaving", {
                  required: "Date of birth is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="state">
                {Trans("state", language)} <span className="required">*</span>
              </Label>
              <input
                id="state"
                type="text"
                placeholder="Enter"
                className="form-control"
                {...register("state", {
                  required: "Is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="city">
                {Trans("city", language)} <span className="required">*</span>
              </Label>
              <input
                id="city"
                type="text"
                placeholder="Enter"
                className="form-control"
                {...register("city", {
                  required: "Is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="zipcode">
                {Trans("zipcode", language)} <span className="required">*</span>
              </Label>
              <input
                id="zipcode"
                type="number"
                placeholder="Enter"
                className="form-control"
                {...register("zipcode", {
                  required: "Is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor="contact_no">
                {Trans("contact_no", language)}{" "}
                <span className="required">*</span>
              </Label>
              <input
                id="contact_no"
                type="number"
                placeholder="Enter"
                className="form-control"
                {...register("contact_no", {
                  required: "Is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <TextArea
                id="address"
                label={Trans("address", language)}
                placeholder="Enter address.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("address", {
                  required: "address is required",
                })}
              />
            </FormGroup>
          </Col>
          <LoaderButton
            formLoadStatus={formloadingStatus}
            btnName={Trans("CREATE", language)}
            className="btn btn-primary btn-block"
          />
        </Row>
      </form>
    </>
  );
};

export default Create;
