import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import FeatherIcon from "feather-icons-react";
import { Modal, Button } from "react-bootstrap";
import POST from "axios/post";
import {
  staffUpdateUrl,
  staffCreateUrl,
  tempUploadFileUrl,
} from "config/index";
import { useForm } from "react-hook-form";
import Notify from "component/Notify";
import {
  Row,
  Col,
  LoaderButton,
  FormGroup,
  Label,
} from "component/UIElement/UIElement";

function BasicInfo({ EditData, refreshInfo }) {
  const { apiToken, language } = useSelector((state) => state.login);
  const [showModal, SetShowModal] = useState(false);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, getValues, setValue, handleSubmit, reset } = useForm();

  const [DynamicData, SetDynamicData] = useState([]);

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

  const onSubmit = (formData) => {
    console.log(formData);
    SetformloadingStatus(true);
    formData.api_token = apiToken;

    POST(staffUpdateUrl, formData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
        const { status, message } = response.data;
        if (status) {
          document.querySelector("form").reset();
          Notify(true, Trans(message, language));
          refreshInfo();
          SetShowModal(false);
        } else {
          if (typeof message === "object") {
            let errMsg = "";
            Object.keys(message).map((key) => {
              errMsg += Trans(message[key][0], language);
              return errMsg;
            });
            Notify(false, errMsg);
          } else {
            Notify(false, Trans(message, language));
          }
        }
      })
      .catch((error) => {
        console.log(error);
        Notify(false, error.message);
        SetformloadingStatus(false);
      });
  };

  const editWorkExp = (CurrentData) => {
    const InputData = JSON.parse(CurrentData);
    const fieldList = getValues();
    for (const key in fieldList) {
      console.log(key, InputData[key]);
      setValue(key, InputData[key]);
    }
    setValue("updateType", "old");
  };

  return (
    <>
      <div className="updated-biography">
        <span>
          BASIC INFORMATION{" "}
          <FeatherIcon
            icon="edit"
            size={15}
            fill="#ffc107"
            color="black"
            onClick={() => {
              SetShowModal(true);
              editWorkExp(JSON.stringify(EditData));
            }}
          />
        </span>
        <ul className="list-unstyled profile-info-list">
          <li>
            <span className="tx-color-03">
              {Trans("EMPLOYEE_ID", language)} : {EditData?.employee_id} <br />
              {Trans("DEPARTMENT", language)} :{" "}
              {EditData?.department?.dept_name} <br />
              {Trans("DESIGNATION", language)} :{" "}
              {EditData?.designation?.designation_name} <br />
              {Trans("GENDER", language)} :{" "}
              {EditData?.gender === 1
                ? "MALE"
                : EditData?.gender === 2
                ? "FEMALE"
                : "TRANSGENDER"}{" "}
              <br />
            </span>
          </li>
        </ul>
        <p>{EditData.bio}</p>
      </div>
      {/* add education modal */}
      <Modal
        show={showModal}
        onHide={() => {
          SetShowModal(false);
        }}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{Trans("BASIC_INFORMATION", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => {
              SetShowModal(false);
            }}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
            <input
              type="hidden"
              {...register("updateSection")}
              defaultValue="basic_info"
            />
            <input
              type="hidden"
              {...register("staff_id")}
              defaultValue={EditData?.staff_id}
            />

            <Row>
              <Col col={12}>
                <Row>
                  <Col col={6}>
                    <FormGroup>
                      <Label
                        display="block"
                        mb="5px"
                        htmlFor={Trans("STAFF_NAME", language)}
                      >
                        {Trans("STAFF_NAME", language)}{" "}
                        <span className="required">*</span>
                      </Label>
                      <input
                        id={Trans("STAFF_NAME", language)}
                        type="text"
                        placeholder={Trans("STAFF_NAME", language)}
                        className="form-control"
                        {...register("staff_name", {
                          required: Trans("STAFF_NAME_REQUIRED", language),
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label
                        display="block"
                        mb="5px"
                        htmlFor={Trans("STAFF_EMAIL", language)}
                      >
                        {Trans("STAFF_EMAIL", language)}{" "}
                        <span className="required">*</span>
                      </Label>
                      <input
                        id={Trans("STAFF_EMAIL", language)}
                        type="email"
                        className="form-control"
                        placeholder={Trans("STAFF_EMAIL", language)}
                        {...register("staff_email", {
                          required: Trans("STAFF_EMAIL", language),
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: Trans("INVALID_EMAIL_ADDRESS", language),
                          },
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label
                        display="block"
                        mb="5px"
                        htmlFor={Trans("STAFF_PHONE", language)}
                      >
                        {Trans("STAFF_PHONE", language)}{" "}
                        <span className="required">*</span>
                      </Label>
                      <input
                        id={Trans("STAFF_PHONE", language)}
                        type="text"
                        placeholder={Trans("STAFF_PHONE", language)}
                        className="form-control"
                        {...register("staff_phone", {
                          required: Trans("STAFF_PHONE_REQUIRED", language),
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label display="block" mb="5px" htmlFor="dept_name">
                        {Trans("DEPT", language)}
                      </Label>
                      <select
                        id="dept_name"
                        className="form-control"
                        {...register("department_id")}
                      >
                        <option value="">
                          {Trans("SELECT_DEPT", language)}
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
                        <option value={0}>
                          {Trans("UNMARRIED", language)}
                        </option>
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
                        htmlFor={Trans("DATE_OF_LEAVING", language)}
                      >
                        {Trans("DATE_OF_LEAVING", language)}{" "}
                        <span className="required">*</span>
                      </Label>
                      <input
                        id={Trans("DATE_OF_LEAVING", language)}
                        type="date"
                        placeholder={Trans("DATE_OF_LEAVING", language)}
                        className="form-control"
                        {...register("date_of_leaving", {
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
                </Row>
              </Col>
              <Col col={12}>
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("SUBMIT", language)}
                  className="btn btn-primary btn-sm"
                />
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal>
      {/* end education modal */}
    </>
  );
}

export default BasicInfo;
