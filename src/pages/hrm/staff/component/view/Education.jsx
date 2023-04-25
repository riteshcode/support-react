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

function Education({ EditData, refreshInfo }) {
  const [educationData, SetEducation] = useState([]);

  const { apiToken, language } = useSelector((state) => state.login);
  const [showModal, SetShowModal] = useState(false);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, getValues, setValue, handleSubmit, reset } = useForm();

  useEffect(() => {
    SetEducation(EditData.staff_qualification);
  }, [EditData.staff_qualification]);

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

  const editWorkExp = (CurrentData) => {
    const InputData = JSON.parse(CurrentData);

    const fieldList = getValues();
    for (const key in fieldList) {
      console.log(key, InputData[key]);
      setValue(key, InputData[key]);
    }
    setValue("updateType", "old");
  };

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

  console.log("years", EndYears);
  return (
    <>
      <div className="card mg-b-20 mg-lg-b-25">
        <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
          <h6 className="tx-uppercase tx-semibold mg-b-0">Education</h6>
          <nav className="nav nav-with-icon tx-13">
            <a
              href="!"
              onClick={(e) => {
                e.preventDefault();
                SetShowModal(true);
                setValue("updateType", "new");
              }}
              className="nav-link"
            >
              <i data-feather="plus"></i> Add New
            </a>
          </nav>
        </div>
        <div className="card-body pd-25">
          {educationData &&
            educationData.map((edu, idx) => {
              const { admission_at, passing_at, university_name } = edu;
              return (
                <div className="media mb-4" key={idx}>
                  <div className="wd-80 ht-80 bg-ui-04 rounded d-flex align-items-center justify-content-center">
                    <i
                      data-feather="book-open"
                      className="tx-white-7 wd-40 ht-40"
                    ></i>
                  </div>
                  <div className="media-body pd-l-25">
                    <h5 className="mg-b-5">
                      {edu?.education?.education_name}{" "}
                      <span className="badge badge-warning">
                        <FeatherIcon
                          icon="edit"
                          size={15}
                          onClick={() => {
                            SetShowModal(true);
                            editWorkExp(JSON.stringify(edu));
                          }}
                        />
                      </span>
                    </h5>
                    <p className="mg-b-3">
                      <span className="tx-medium tx-color-02">
                        {university_name}
                      </span>
                    </p>
                    <span className="d-block tx-13 tx-color-03">
                      {admission_at} - {passing_at}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="card-footer bg-transparent pd-y-15 pd-x-20">
          <nav className="nav nav-with-icon tx-13">
            <a href="" className="nav-link">
              Show More Experiences (4)
              <i
                data-feather="chevron-down"
                className="mg-l-2 mg-r-0 mg-t-2"
              ></i>
            </a>
          </nav>
        </div>
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
          <Modal.Title>{Trans("EDUCATION", language)}</Modal.Title>
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
            <Row>
              <input
                type="hidden"
                {...register("updateSection")}
                defaultValue="education"
              />
              <input
                type="hidden"
                {...register("updateType")}
                defaultValue="new"
              />
              <input type="hidden" {...register("qualification_id")} />
              <input
                type="hidden"
                {...register("staff_id")}
                defaultValue={EditData?.staff_id}
              />
              <Col col={12}>
                <Row>
                  <Col col={4}>
                    <FormGroup>
                      <Label display="block" mb="5px" htmlFor={"education_id"}>
                        {Trans("EDUCATION", language)}
                      </Label>
                      <select
                        id={"education_id"}
                        className="form-control"
                        {...register("education_id", {
                          required: Trans("EDUCATION_REQUIRED", language),
                        })}
                      >
                        <option value="">
                          {Trans("SELECT_EDUCATION", language)}
                        </option>
                        {DynamicData?.education_list &&
                          DynamicData?.education_list.map((edu) => {
                            const { education_id, education_name } = edu;
                            return (
                              <option key={education_id} value={education_id}>
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
                        htmlFor={"UNIVERSITY_NAME"}
                      >
                        {Trans("UNIVERSITY_NAME", language)}
                      </Label>
                      <input
                        {...register("university_name", {
                          required: Trans("UNIVERSITY_NAME_REQUIRED", language),
                        })}
                        className="form-control"
                        id={"UNIVERSITY_NAME"}
                        placeholder={Trans("UNIVERSITY_NAME", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={4}>
                    <FormGroup>
                      <Label display="block" mb="5px" htmlFor={"admission_at"}>
                        {Trans("ADMISSION_YEAR", language)}
                      </Label>
                      <select
                        {...register("admission_at")}
                        className="form-control"
                        id={"admission_at"}
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
                      <Label display="block" mb="5px" htmlFor={"passing_at"}>
                        {Trans("PASSING_YEAR", language)}
                      </Label>
                      <select
                        {...register("passing_at", {})}
                        className="form-control"
                        id={"passing_at"}
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
                      <Label display="block" mb="5px" htmlFor={"document_type"}>
                        {Trans("DOCUMENT_TYPE", language)}
                      </Label>
                      <select
                        id={"document_type"}
                        className="form-control"
                        {...register("document_type")}
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
                                <option key={document_id} value={document_id}>
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
                      <Label display="block" mb="5px" htmlFor={"fileupload"}>
                        {Trans("DOCUMENT_UPLOAD", language)}
                      </Label>
                      <div className="custom-file">
                        <input type="hidden" {...register("document")} />
                        <input
                          type="file"
                          className="custom-file-input"
                          id="customFile"
                          onChange={(event) =>
                            HandleDocumentUpload(
                              event,
                              "fileupload",
                              "document"
                            )
                          }
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFile"
                        >
                          Choose file
                        </label>
                        <div id={"fileupload"}></div>
                      </div>
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

export default Education;
