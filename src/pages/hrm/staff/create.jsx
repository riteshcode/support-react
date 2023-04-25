import React, { useState, useEffect } from "react";
import POST, { TempFileUpload } from "axios/post";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { staffStoreUrl, staffCreateUrl, tempUploadFileUrl } from "config/index";
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
  SingleImagePreview,
} from "component/UIElement/UIElement";
import Alert from "component/UIElement/Alert";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import CC from "./CC";

const Create = ({ ...props }) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [msgType, setMsgType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [DynamicData, SetDynamicData] = useState([]);

  const [diffAddress, SetDiffAddress] = useState(false);

  const { register, control, setValue, handleSubmit, reset } = useForm({
    defaultValues: {
      education: [{ education_id: "", admission_at: "", passing_at: "" }],
      workexp: [
        {
          company_name: "",
          company_address: "",
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          date_of_joining: "",
          date_of_leaving: "",
          reason_for_leaving: "",
        },
      ],
    },
  });

  const educationFields = useFieldArray({
    control,
    name: "education",
  });

  const workexpFields = useFieldArray({
    control,
    name: "workexp",
  });

  const onSubmit = (formData) => {
    console.log(formData);
    SetformloadingStatus(true);
    formData.api_token = apiToken;

    POST(staffStoreUrl, formData)
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
            Notify(false, Trans(message, language));
            setErrorMsg(Trans(message, language));
          }
        }
      })
      .catch((error) => {
        console.log(error);
        Notify(false, error.message);
        setMsgType("danger");
        SetformloadingStatus(false);
        setErrorMsg("Something went wrong !");
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    function getDynamicData() {
      const filterData = { api_token: apiToken };
      POST(staffCreateUrl, filterData)
        .then((response) => {
          console.log("response", response);
          const { status, data, message } = response.data;
          if (status) SetDynamicData(data);
          else Notify(false, Trans(message, language));
        })
        .catch((error) => {
          Notify(false, error.message);
          console.error("There was an error!", error);
        });
    }
    getDynamicData();
    return () => {
      abortController.abort();
    };
  }, [apiToken, language]);

  const formStepName = [
    {
      labelId: 1,
      label: "Personal Information",
    },
    {
      labelId: 2,
      label: "Qualification Information",
    },
    {
      labelId: 3,
      label: "Work Experiance Information",
    },
  ];
  const [formstep, Setformstep] = useState(1);

  const HandleDocumentUpload = (event, previewUrlId, StoreID) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;

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

  const [userType, SetUserType] = useState("new");

  const currntDate = new Date();

  const StartYears = parseInt(currntDate.getFullYear()) - 50;
  const EndYears = parseInt(currntDate.getFullYear()) + 5;

  const admission_year = [];
  const passing_year = [];

  for (let index = StartYears; index < EndYears; index++) {
    admission_year.push(
      <option key={index} value={index}>
        {index}
      </option>
    );
    passing_year.push(
      <option key={index} value={index}>
        {index}
      </option>
    );
  }

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
          <Col col={12}>
            <ul className="steps steps-tab">
              {formStepName &&
                formStepName.map((formInfo, idx) => {
                  const classInfo =
                    formInfo.labelId !== formstep
                      ? "step-link"
                      : "step-link active-step";
                  return (
                    <li className="step-item" key={idx}>
                      <a
                        onClick={() => {
                          Setformstep(formInfo.labelId);
                        }}
                        className={classInfo}
                      >
                        <span className="step-number">{formInfo.labelId}</span>
                        <span className="step-title">{formInfo.label}</span>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </Col>
        </Row>
        {formstep === 1 && (
          <Row>
            <Col col={12}>
              <h3 className="mt-3 mb-3">Profile Info</h3>
            </Col>
            <Col col={12}>
              <Row>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("USER_TYPE", language)}
                    >
                      {Trans("USER_TYPE", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <select
                      id={Trans("USER_TYPE", language)}
                      className="form-control"
                      {...register("user_type")}
                      onChange={(event) => {
                        SetUserType(event.target.value);
                      }}
                      defaultValue={userType}
                    >
                      <option value="new">{Trans("NEW", language)}</option>
                      <option value="existing">
                        {Trans("EXISTING", language)}
                      </option>
                    </select>
                  </FormGroup>
                </Col>
                {userType === "existing" && (
                  <Col col={6}>
                    <FormGroup>
                      <Label display="block" mb="5px" htmlFor="role_name">
                        {Trans("USER", language)}{" "}
                        <span className="required">*</span>
                      </Label>
                      <select
                        id={Trans("USER", language)}
                        className="form-control"
                        {...register("user_id", {
                          required: Trans("USER_REQUIRED", language),
                        })}
                      >
                        <option value="">
                          {Trans("SELECT_USER", language)}
                        </option>
                        {DynamicData?.user_list &&
                          DynamicData?.user_list.map((user) => {
                            const { id, email } = user;
                            return (
                              <option key={id} value={id}>
                                {email}
                              </option>
                            );
                          })}
                      </select>
                    </FormGroup>
                  </Col>
                )}
                {userType === "new" && (
                  <>
                    <Col col={6}>
                      <FormGroup>
                        <Label display="block" mb="5px" htmlFor="name">
                          {Trans("STAFF_NAME", language)}{" "}
                          <span className="required">*</span>
                        </Label>
                        <input
                          id="name"
                          type="text"
                          placeholder={Trans("STAFF_NAME", language)}
                          className="form-control"
                          {...register("name", {
                            required: Trans("STAFF_NAME_REQUIRED", language),
                          })}
                        />
                      </FormGroup>
                    </Col>
                    <Col col={6}>
                      <FormGroup>
                        <Label display="block" mb="5px" htmlFor="email">
                          {Trans("STAFF_EMAIL", language)}{" "}
                          <span className="required">*</span>
                        </Label>
                        <input
                          id="email"
                          type="email"
                          className="form-control"
                          placeholder={Trans("STAFF_EMAIL", language)}
                          {...register("email", {
                            required: Trans("STAFF_EMAIL", language),
                            pattern: {
                              value:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: Trans("INVALID_EMAIL_ADDRESS", language),
                            },
                          })}
                        />
                      </FormGroup>
                    </Col>
                    <Col col={6}>
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
                    <Col col={6}>
                      <FormGroup>
                        <Label display="block" mb="5px" htmlFor="role_name">
                          {Trans("ROLE", language)}{" "}
                          <span className="required">*</span>
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
                  </>
                )}
                <Col col={6}>
                  <FormGroup>
                    <Label display="block" mb="5px" htmlFor="dept_name">
                      {Trans("DEPARTMENT", language)}
                    </Label>
                    <select
                      id="dept_name"
                      className="form-control"
                      {...register("department_id")}
                    >
                      <option value="">
                        {Trans("SELECT_DEPARTMENT", language)}
                      </option>
                      {DynamicData?.department_list &&
                        DynamicData?.department_list.map((dept) => {
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
                  <FormGroup>
                    <Label display="block" mb="5px" htmlFor="dept_name">
                      {Trans("DESIGNATION", language)}{" "}
                    </Label>
                    <select
                      id="dept_name"
                      className="form-control"
                      {...register("designation_id")}
                    >
                      <option value="">
                        {Trans("SELECT_DESIGNATION", language)}
                      </option>
                      {DynamicData?.designation_list &&
                        DynamicData?.designation_list.map((dept) => {
                          return (
                            <option
                              key={dept.designation_id}
                              value={dept.designation_id}
                            >
                              {dept.designation_name}
                            </option>
                          );
                        })}
                    </select>
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label display="block" mb="5px" htmlFor="marital_status">
                      {Trans("MARITAL_STATUS", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <select
                      id="marital_status"
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
                  <FormGroup>
                    <Label display="block" mb="5px" htmlFor="gender">
                      {Trans("GENDER", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <select
                      id="gender"
                      className="form-control"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    >
                      <option value="">
                        {Trans("SELECT_GENDER", language)}
                      </option>
                      <option value={1}>{Trans("MALE", language)}</option>
                      <option value={2}>{Trans("FEMALE", language)}</option>
                      <option value={3}>
                        {Trans("TRANSGENDER", language)}
                      </option>
                    </select>
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("DATE_OF_BIRTH", language)}
                    >
                      {Trans("DATE_OF_BIRTH", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <input
                      id={Trans("DATE_OF_BIRTH", language)}
                      type="date"
                      placeholder={Trans("DATE_OF_BIRTH", language)}
                      className="form-control"
                      {...register("date_of_birth", {
                        required: "Date of birth is required",
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("DATE_OF_JOINING", language)}
                    >
                      {Trans("DATE_OF_JOINING", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <input
                      id={Trans("DATE_OF_JOINING", language)}
                      type="date"
                      placeholder={Trans("DATE_OF_JOINING", language)}
                      className="form-control"
                      {...register("date_of_joining", {
                        required: "Date of birth is required",
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("SALARY", language)}
                    >
                      {Trans("SALARY", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <input
                      id={Trans("SALARY", language)}
                      type="number"
                      step={0.01}
                      placeholder={Trans("SALARY", language)}
                      className="form-control"
                      {...register("salary", {
                        required: Trans("SALARY_REQUIRED", language),
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("CONTACT_NUMBER", language)}
                    >
                      {Trans("CONTACT_NUMBER", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <input
                      id={Trans("CONTACT_NUMBER", language)}
                      type="number"
                      placeholder={Trans("CONTACT_NUMBER", language)}
                      className="form-control"
                      {...register("phone_no", {
                        required: "Is required",
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("STREET_ADDRESS", language)}
                    >
                      {Trans("STREET_ADDRESS", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <input
                      id={Trans("STREET_ADDRESS", language)}
                      type="text"
                      placeholder={Trans("STREET_ADDRESS", language)}
                      className="form-control"
                      {...register("street_address", {
                        required: Trans("STREET_ADDRESS_REQUIRED", language),
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("CITY", language)}
                    >
                      {Trans("CITY", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <input
                      id={Trans("CITY", language)}
                      type="text"
                      placeholder={Trans("CITY", language)}
                      className="form-control"
                      {...register("city", {
                        required: "Is required",
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("STATE", language)}
                    >
                      {Trans("STATE", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <input
                      id={Trans("STATE", language)}
                      type="text"
                      placeholder={Trans("STATE", language)}
                      className="form-control"
                      {...register("state", {
                        required: "Is required",
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("COUNTRY", language)}
                    >
                      {Trans("COUNTRY", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <select
                      id={Trans("COUNTRY", language)}
                      className="form-control"
                      {...register("countries_id", {
                        required: Trans("ROLE_REQUIRED", language),
                      })}
                    >
                      <option>{Trans("SELECT_COUNTRY", language)}</option>
                      {DynamicData?.country_list &&
                        DynamicData?.country_list.map((INFO) => {
                          const { countries_id, countries_name } = INFO;
                          return (
                            <option key={countries_id} value={countries_id}>
                              {countries_name}
                            </option>
                          );
                        })}
                    </select>
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("POSTCODE", language)}
                    >
                      {Trans("POSTCODE", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <input
                      id={Trans("POSTCODE", language)}
                      type="number"
                      placeholder={Trans("POSTCODE", language)}
                      className="form-control"
                      {...register("postcode", {
                        required: "Is required",
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col col={12}>
                  <FormGroup>
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("DIFFERENT_PERMANENT_ADDRESS", language)}
                    >
                      {Trans("DIFFERENT_PERMANENT_ADDRESS", language)}{" "}
                      <span className="required">*</span>
                    </Label>
                    <input
                      style={{ marginLeft: 10 }}
                      id={Trans("DIFFERENT_PERMANENT_ADDRESS", language)}
                      type="checkbox"
                      placeholder={Trans(
                        "DIFFERENT_PERMANENT_ADDRESS",
                        language
                      )}
                      {...register("address_type")}
                      defaultValue={1}
                      defaultChecked={diffAddress}
                      onClick={() => SetDiffAddress(diffAddress ? false : true)}
                    />
                  </FormGroup>
                </Col>
                {diffAddress && (
                  <>
                    <Col col={6}>
                      <FormGroup>
                        <Label
                          display="block"
                          mb="5px"
                          htmlFor={Trans("CONTACT_NUMBER", language)}
                        >
                          {Trans("CONTACT_NUMBER", language)}{" "}
                          <span className="required">*</span>
                        </Label>
                        <input
                          id={Trans("CONTACT_NUMBER", language)}
                          type="number"
                          placeholder={Trans("CONTACT_NUMBER", language)}
                          className="form-control"
                          {...register("permanent_phone_no")}
                        />
                      </FormGroup>
                    </Col>
                    <Col col={6}>
                      <FormGroup>
                        <Label
                          display="block"
                          mb="5px"
                          htmlFor={Trans("STREET_ADDRESS", language)}
                        >
                          {Trans("STREET_ADDRESS", language)}{" "}
                          <span className="required">*</span>
                        </Label>
                        <input
                          id={Trans("STREET_ADDRESS", language)}
                          type="text"
                          placeholder={Trans("STREET_ADDRESS", language)}
                          className="form-control"
                          {...register("permanent_street_address")}
                        />
                      </FormGroup>
                    </Col>
                    <Col col={6}>
                      <FormGroup>
                        <Label
                          display="block"
                          mb="5px"
                          htmlFor={Trans("CITY", language)}
                        >
                          {Trans("CITY", language)}{" "}
                          <span className="required">*</span>
                        </Label>
                        <input
                          id={Trans("CITY", language)}
                          type="text"
                          placeholder={Trans("CITY", language)}
                          className="form-control"
                          {...register("permanent_city")}
                        />
                      </FormGroup>
                    </Col>
                    <Col col={6}>
                      <FormGroup>
                        <Label
                          display="block"
                          mb="5px"
                          htmlFor={Trans("STATE", language)}
                        >
                          {Trans("STATE", language)}{" "}
                          <span className="required">*</span>
                        </Label>
                        <input
                          id={Trans("STATE", language)}
                          type="text"
                          placeholder={Trans("STATE", language)}
                          className="form-control"
                          {...register("permanent_state")}
                        />
                      </FormGroup>
                    </Col>
                    <Col col={6}>
                      <FormGroup>
                        <Label
                          display="block"
                          mb="5px"
                          htmlFor={Trans("COUNTRY", language)}
                        >
                          {Trans("COUNTRY", language)}{" "}
                          <span className="required">*</span>
                        </Label>
                        <select
                          id={Trans("COUNTRY", language)}
                          className="form-control"
                          {...register("permanent_countries_id")}
                        >
                          <option>{Trans("SELECT_COUNTRY", language)}</option>
                          {DynamicData?.country_list &&
                            DynamicData?.country_list.map((INFO) => {
                              const { countries_id, countries_name } = INFO;
                              return (
                                <option key={countries_id} value={countries_id}>
                                  {countries_name}
                                </option>
                              );
                            })}
                        </select>
                      </FormGroup>
                    </Col>
                    <Col col={6}>
                      <FormGroup>
                        <Label
                          display="block"
                          mb="5px"
                          htmlFor={Trans("POSTCODE", language)}
                        >
                          {Trans("POSTCODE", language)}{" "}
                          <span className="required">*</span>
                        </Label>
                        <input
                          id={Trans("POSTCODE", language)}
                          type="number"
                          placeholder={Trans("POSTCODE", language)}
                          className="form-control"
                          {...register("permanent_postcode")}
                        />
                      </FormGroup>
                    </Col>
                  </>
                )}
              </Row>
            </Col>
            <Col col={12}>
              <button
                className="btn btn-info btn-sm"
                onClick={() => {
                  Setformstep(parseInt(formstep) + 1);
                }}
              >
                Next
              </button>{" "}
              <LoaderButton
                formLoadStatus={formloadingStatus}
                btnName={Trans("SUBMIT", language)}
                className="btn btn-primary btn-sm"
              />
            </Col>
          </Row>
        )}
        {formstep === 2 && (
          <Row className="mt-3 mb-3">
            <Col col={6}>
              <h3>Education Info</h3>
            </Col>
            <Col col={6} className="text-right">
              <button
                type="button"
                className="btn btn-sm btn-info"
                onClick={() => {
                  educationFields.prepend({});
                }}
              >
                <FeatherIcon icon="plus" fill="white" />
              </button>{" "}
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={() =>
                  reset({
                    education: [
                      { education_id: "", admission_at: "", passing_at: "" },
                    ],
                  })
                }
              >
                <FeatherIcon icon="refresh-cw" />
              </button>
            </Col>
            <Col col={12} className="mb-3 mt-3">
              {educationFields.fields.map((item, index) => {
                return (
                  <Row key={item.id}>
                    <Col col={12}>
                      <div
                        id="accordion4"
                        className="accordion accordion-style2 ui-accordion ui-widget ui-helper-reset "
                      >
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                          <h6
                            style={{ height: "40px" }}
                            className="accordion-title ui-accordion-header ui-corner-top ui-state-default ui-accordion-header-active ui-state-active ui-accordion-icons h6Module"
                          >
                            <span style={{ float: "right" }}>
                              <FeatherIcon
                                icon="x-square"
                                color="red"
                                onClick={() => educationFields.remove(index)}
                                size={20}
                              />
                            </span>
                          </h6>
                          <div className="accordion-body ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content h6bodyIn">
                            <div className="row">
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`education.${index}.education_id`}
                                  >
                                    {Trans("EDUCATION", language)}
                                  </Label>
                                  <select
                                    id={`education.${index}.education_id`}
                                    className="form-control"
                                    {...register(
                                      `education.${index}.education_id`
                                    )}
                                  >
                                    <option value="">
                                      {Trans("SELECT_EDUCATION", language)}
                                    </option>
                                    {DynamicData?.education_list &&
                                      DynamicData?.education_list.map((edu) => {
                                        const { education_id, education_name } =
                                          edu;
                                        return (
                                          <option
                                            key={education_id}
                                            value={education_id}
                                          >
                                            {education_name}
                                          </option>
                                        );
                                      })}
                                  </select>
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`education.${index}.university_name`}
                                  >
                                    {Trans("UNIVERSITY_NAME", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `education.${index}.university_name`
                                    )}
                                    className="form-control"
                                    id={`education.${index}.university_name`}
                                    placeholder={Trans(
                                      "UNIVERSITY_NAME",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>

                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`education.${index}.admission_at`}
                                  >
                                    {Trans("ADMISSION_YEAR", language)}
                                  </Label>
                                  <select
                                    {...register(
                                      `education.${index}.admission_at`
                                    )}
                                    className="form-control"
                                    id={`education.${index}.admission_at`}
                                  >
                                    <option value="">
                                      {Trans("SELECT_ADMISSION_YEAR", language)}
                                    </option>
                                    {admission_year}
                                  </select>
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`education.${index}.passing_at`}
                                  >
                                    {Trans("PASSING_YEAR", language)}
                                  </Label>
                                  <select
                                    {...register(
                                      `education.${index}.passing_at`,
                                      {}
                                    )}
                                    className="form-control"
                                    id={`education.${index}.passing_at`}
                                  >
                                    <option value="">
                                      {Trans("SELECT_PASSING_YEAR", language)}
                                    </option>
                                    {passing_year}
                                  </select>
                                </FormGroup>
                              </Col>

                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`education.${index}.document_type`}
                                  >
                                    {Trans("DOCUMENT_TYPE", language)}
                                  </Label>
                                  <select
                                    id={`education.${index}.document_type`}
                                    className="form-control"
                                    {...register(
                                      `education.${index}.document_type`
                                    )}
                                  >
                                    <option value="">
                                      {Trans("SELECT_DOCUMENT_TYPE", language)}
                                    </option>
                                    {DynamicData?.document_list &&
                                      DynamicData?.document_list.map((doc) => {
                                        const {
                                          document_id,
                                          document_type,
                                          document_name,
                                        } = doc;
                                        if (document_type === 3) {
                                          return (
                                            <option
                                              key={document_id}
                                              value={document_id}
                                            >
                                              {document_name}
                                            </option>
                                          );
                                        }
                                      })}
                                  </select>
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`education.${index}.fileupload`}
                                  >
                                    {Trans("DOCUMENT_UPLOAD", language)}
                                  </Label>
                                  <div className="custom-file">
                                    <input
                                      type="hidden"
                                      {...register(
                                        `education.${index}.document`
                                      )}
                                    />
                                    <input
                                      type="file"
                                      className="custom-file-input"
                                      id="customFile"
                                      onChange={(event) =>
                                        HandleDocumentUpload(
                                          event,
                                          `education.${index}.fileupload`,
                                          `education.${index}.document`
                                        )
                                      }
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="customFile"
                                    >
                                      Choose file
                                    </label>
                                    <div
                                      id={`education.${index}.fileupload`}
                                    ></div>
                                  </div>
                                </FormGroup>
                              </Col>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </Col>
            <Col col={12}>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => {
                  Setformstep(parseInt(formstep) - 1);
                }}
              >
                Prev
              </button>{" "}
              <button
                className="btn btn-info btn-sm"
                onClick={() => {
                  Setformstep(parseInt(formstep) + 1);
                }}
              >
                Next
              </button>
            </Col>
          </Row>
        )}
        {formstep === 3 && (
          <Row className="mt-3 mb-3">
            <Col col={6}>
              <h3>Work Experiance Info</h3>
            </Col>
            <Col col={6} className="text-right">
              <button
                type="button"
                className="btn btn-sm btn-info"
                onClick={() => {
                  workexpFields.prepend({});
                }}
              >
                <FeatherIcon icon="plus" fill="white" />
              </button>{" "}
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={() =>
                  reset({
                    workexp: [
                      {
                        company_name: "",
                        company_address: "",
                        contact_name: "",
                        contact_email: "",
                        contact_phone: "",
                        date_of_joining: "",
                        date_of_leaving: "",
                        reason_for_leaving: "",
                      },
                    ],
                  })
                }
              >
                <FeatherIcon icon="refresh-cw" />
              </button>
            </Col>
            <Col col={12} className="mb-3 mt-3">
              {workexpFields.fields.map((item, index) => {
                return (
                  <Row key={item.id}>
                    <Col col={12}>
                      <div
                        id="accordion4"
                        className="accordion accordion-style2 ui-accordion ui-widget ui-helper-reset "
                      >
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                          <h6
                            style={{ height: "40px" }}
                            className="accordion-title ui-accordion-header ui-corner-top ui-state-default ui-accordion-header-active ui-state-active ui-accordion-icons h6Module"
                          >
                            <span style={{ float: "right" }}>
                              <FeatherIcon
                                icon="x-square"
                                color="red"
                                onClick={() => workexpFields.remove(index)}
                                size={20}
                              />
                            </span>
                          </h6>
                          <div className="accordion-body ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content h6bodyIn">
                            <Row>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.company_name`}
                                  >
                                    {Trans("COMPANY_NAME", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `workexp.${index}.company_name`
                                    )}
                                    className="form-control"
                                    id={`workexp.${index}.company_name`}
                                    placeholder={Trans(
                                      "COMPANY_NAME",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.company_designation`}
                                  >
                                    {Trans("COMPANY_DESIGNATION", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `workexp.${index}.company_designation`
                                    )}
                                    className="form-control"
                                    id={`workexp.${index}.company_designation`}
                                    placeholder={Trans(
                                      "COMPANY_DESIGNATION",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.company_address`}
                                  >
                                    {Trans("COMPANY_ADDRESS", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `workexp.${index}.company_address`
                                    )}
                                    className="form-control"
                                    id={`workexp.${index}.company_address`}
                                    placeholder={Trans(
                                      "COMPANY_ADDRESS",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.contact_name`}
                                  >
                                    {Trans("CONTACT_NAME", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `workexp.${index}.contact_name`
                                    )}
                                    className="form-control"
                                    id={`workexp.${index}.contact_name`}
                                    placeholder={Trans(
                                      "CONTACT_NAME",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.contact_email`}
                                  >
                                    {Trans("CONTACT_EMAIL", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `workexp.${index}.contact_email`
                                    )}
                                    className="form-control"
                                    id={`workexp.${index}.contact_email`}
                                    placeholder={Trans(
                                      "CONTACT_EMAIL",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.contact_phone`}
                                  >
                                    {Trans("CONTACT_PHONE", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `workexp.${index}.contact_phone`
                                    )}
                                    className="form-control"
                                    id={`workexp.${index}.contact_phone`}
                                    placeholder={Trans(
                                      "CONTACT_PHONE",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.date_of_joining`}
                                  >
                                    {Trans("DATE_OF_JOINING", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `workexp.${index}.date_of_joining`
                                    )}
                                    type="date"
                                    className="form-control"
                                    id={`workexp.${index}.date_of_joining`}
                                    placeholder={Trans(
                                      "DATE_OF_JOINING",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.date_of_leaving`}
                                  >
                                    {Trans("DATE_OF_LEAVING", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `workexp.${index}.date_of_leaving`
                                    )}
                                    type="date"
                                    className="form-control"
                                    id={`workexp.${index}.date_of_leaving`}
                                    placeholder={Trans(
                                      "DATE_OF_LEAVING",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col col={4}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.reason_for_leaving`}
                                  >
                                    {Trans("REASON_FOR_LEAVING", language)}
                                  </Label>
                                  <input
                                    {...register(
                                      `workexp.${index}.reason_for_leaving`
                                    )}
                                    className="form-control"
                                    id={`workexp.${index}.reason_for_leaving`}
                                    placeholder={Trans(
                                      "REASON_FOR_LEAVING",
                                      language
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col col={6}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.document_type`}
                                  >
                                    {Trans("DOCUMENT_TYPE", language)}
                                  </Label>
                                  <select
                                    id={`workexp.${index}.document_type`}
                                    className="form-control"
                                    {...register(
                                      `workexp.${index}.document_type`
                                    )}
                                  >
                                    <option value="">
                                      {Trans("SELECT_DOCUMENT_TYPE", language)}
                                    </option>
                                    {DynamicData?.document_list &&
                                      DynamicData?.document_list.map((doc) => {
                                        const {
                                          document_id,
                                          document_type,
                                          document_name,
                                        } = doc;
                                        if (document_type === 4) {
                                          return (
                                            <option
                                              key={document_id}
                                              value={document_id}
                                            >
                                              {document_name}
                                            </option>
                                          );
                                        }
                                      })}
                                  </select>
                                </FormGroup>
                              </Col>
                              <Col col={6}>
                                <FormGroup>
                                  <Label
                                    display="block"
                                    mb="5px"
                                    htmlFor={`workexp.${index}.fileupload`}
                                  >
                                    {Trans("DOCUMENT_UPLOAD", language)}
                                  </Label>
                                  <div className="custom-file">
                                    <input
                                      type="hidden"
                                      {...register(`workexp.${index}.document`)}
                                    />
                                    <input
                                      type="file"
                                      className="custom-file-input"
                                      id="customFile"
                                      onChange={(event) =>
                                        HandleDocumentUpload(
                                          event,
                                          `workexp.${index}.fileupload`,
                                          `workexp.${index}.document`
                                        )
                                      }
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="customFile"
                                    >
                                      Choose file
                                    </label>
                                    <div
                                      id={`workexp.${index}.fileupload`}
                                    ></div>
                                  </div>
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </Col>
            <Col col={12}>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => {
                  Setformstep(parseInt(formstep) - 1);
                }}
              >
                Prev
              </button>{" "}
              <LoaderButton
                formLoadStatus={formloadingStatus}
                btnName={Trans("SUBMIT", language)}
                className="btn btn-primary btn-sm"
              />
            </Col>
          </Row>
        )}
      </form>
    </>
  );
};

export default Create;
