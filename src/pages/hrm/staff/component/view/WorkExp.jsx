import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import Verified from "./verified";
import Terminate from "./terminate";
import WebsiteLink from "config/WebsiteLink";
import { Anchor } from "component/UIElement/UIElement";

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

function WorkExp({ EditData, refreshInfo }) {
  const { apiToken, language } = useSelector((state) => state.login);
  const [staffExp, SetstaffExp] = useState([]);
  const [showModal, SetShowModal] = useState(false);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, getValues, setValue, handleSubmit, reset } = useForm();

  useEffect(() => {
    SetstaffExp(EditData.staff_experiance);
  }, [EditData.staff_experiance]);

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

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [showView, setShowView] = useState(false);
  const handleViewModalClose = () => setShowView(false);
  const handleViewModalShow = () => setShowView(true);

  return (
    <>
      <div className="card mg-b-20 mg-lg-b-25">
        <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
          <h6 className="tx-uppercase tx-semibold mg-b-0">Work Experience</h6>

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
            <Button variant="primary" onClick={handleModalShow}>
              <FeatherIcon icon="plus" fill="white" className="wd-10 mg-r-5" />
              {Trans("VERIFIED", language)}
            </Button>
            <Button variant="primary" onClick={handleViewModalShow}>
              <FeatherIcon fill="white" className="wd-10 mg-r-5" />
              {Trans("TERMINATE", language)}
            </Button>
            <Anchor path={WebsiteLink(`/staff`)} variant="primary">
              <FeatherIcon icon="minus" fill="white" className="wd-10 mg-r-5" />
              {Trans("GO_BACK", language)}
            </Anchor>
          </nav>
        </div>
        <div className="card-body pd-25">
          {staffExp &&
            staffExp.map((exp, idx) => {
              const {
                company_name,
                contact_email,
                date_of_joining,
                date_of_leaving,
                reason_for_leaving,
                company_address,
                contact_name,
                company_designation,
                contact_phone,
              } = exp;
              return (
                <div className="media d-block d-sm-flex mb-3 mt-2" key={idx}>
                  <div className="wd-80 ht-80 bg-ui-04 rounded d-flex align-items-center justify-content-center">
                    <i
                      data-feather="briefcase"
                      className="tx-white-7 wd-40 ht-40"
                    ></i>
                  </div>
                  <div className="media-body pd-t-25 pd-sm-t-0 pd-sm-l-25">
                    <h5 className="mg-b-5">
                      {company_designation}{" "}
                      <span className="badge badge-warning">
                        <FeatherIcon
                          icon="edit"
                          size={15}
                          onClick={() => {
                            SetShowModal(true);
                            editWorkExp(JSON.stringify(exp));
                          }}
                        />
                      </span>
                    </h5>
                    <p className="mg-b-3 tx-color-02">
                      <span className="tx-medium tx-color-01">
                        {company_name}
                      </span>
                      , {company_address}
                    </p>
                    <span className="d-block tx-13 tx-color-03">
                      {date_of_joining} - {date_of_leaving}
                    </span>

                    <ul className="pd-l-10 mg-0 mt-2 tx-13">
                      <li>
                        <b>Contact Name : </b> {contact_name}
                      </li>
                      <li>
                        <b>Contact Email : </b>
                        {contact_email}
                      </li>
                      <li>
                        <b>Contact Number : </b>
                        {contact_phone}
                      </li>
                      <li>
                        <b>Reason For Leaving : </b>
                        {reason_for_leaving}
                      </li>
                    </ul>
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
      {/* add Work Exp modal */}
      <Modal
        show={showModal}
        onHide={() => {
          SetShowModal(false);
        }}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{Trans("WORK_EXPERIENCE", language)}</Modal.Title>
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
                defaultValue="workexp"
              />
              <input
                type="hidden"
                {...register("updateType")}
                defaultValue="new"
              />
              <input type="hidden" {...register("experience_id")} />
              <input
                type="hidden"
                {...register("staff_id")}
                defaultValue={EditData?.staff_id}
              />
              <Col col={12}>
                <Row>
                  <Col col={6}>
                    <FormGroup>
                      <Label display="block" mb="5px" htmlFor={"company_name"}>
                        {Trans("COMPANY_NAME", language)}
                      </Label>
                      <input
                        {...register("company_name")}
                        className="form-control"
                        id={"company_name"}
                        placeholder={Trans("COMPANY_NAME", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label
                        display="block"
                        mb="5px"
                        htmlFor={"COMPANY_DESIGNATION"}
                      >
                        {Trans("COMPANY_DESIGNATION", language)}
                      </Label>
                      <input
                        {...register("company_designation")}
                        className="form-control"
                        id={"COMPANY_DESIGNATION"}
                        placeholder={Trans("COMPANY_DESIGNATION", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label
                        display="block"
                        mb="5px"
                        htmlFor={"company_address"}
                      >
                        {Trans("COMPANY_ADDRESS", language)}
                      </Label>
                      <input
                        {...register("company_address")}
                        className="form-control"
                        id={"company_address"}
                        placeholder={Trans("COMPANY_ADDRESS", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label display="block" mb="5px" htmlFor={"contact_name"}>
                        {Trans("CONTACT_NAME", language)}
                      </Label>
                      <input
                        {...register("contact_name")}
                        className="form-control"
                        id={"contact_name"}
                        placeholder={Trans("CONTACT_NAME", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label display="block" mb="5px" htmlFor={"contact_email"}>
                        {Trans("CONTACT_EMAIL", language)}
                      </Label>
                      <input
                        {...register("contact_email")}
                        className="form-control"
                        id={"contact_email"}
                        placeholder={Trans("CONTACT_EMAIL", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label display="block" mb="5px" htmlFor={"contact_phone"}>
                        {Trans("CONTACT_PHONE", language)}
                      </Label>
                      <input
                        {...register("contact_phone")}
                        className="form-control"
                        id={"contact_phone"}
                        placeholder={Trans("CONTACT_PHONE", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label
                        display="block"
                        mb="5px"
                        htmlFor={"date_of_joining"}
                      >
                        {Trans("DATE_OF_JOINING", language)}
                      </Label>
                      <input
                        {...register("date_of_joining")}
                        className="form-control"
                        id={"date_of_joining"}
                        type="date"
                        placeholder={Trans("DATE_OF_JOINING", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup>
                      <Label
                        display="block"
                        mb="5px"
                        htmlFor={"date_of_leaving"}
                      >
                        {Trans("DATE_OF_LEAVING", language)}
                      </Label>
                      <input
                        {...register("date_of_leaving")}
                        className="form-control"
                        id={"date_of_leaving"}
                        type="date"
                        placeholder={Trans("DATE_OF_LEAVING", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={12}>
                    <FormGroup>
                      <Label
                        display="block"
                        mb="5px"
                        htmlFor={"reason_for_leaving"}
                      >
                        {Trans("REASON_FOR_LEAVING", language)}
                      </Label>
                      <input
                        {...register("reason_for_leaving")}
                        className="form-control"
                        id={"reason_for_leaving"}
                        placeholder={Trans("REASON_FOR_LEAVING", language)}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={6}>
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
                            if (document_type === 4) {
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
                  <Col col={6}>
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
                          {Trans("CHOOSE_FILE", language)}
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
      {/* end Work exp modal */} {/* verified modal */}
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("VERIFIED_STAFF", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Verified
            handleModalClose={handleModalClose}
            staffId={EditData?.staff_id}
          />
        </Modal.Body>
      </Modal>
      {/* end verified modal */}
      {/* terminate modal */}
      <Modal show={showView} onHide={handleViewModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("TERMINATE_STAFF", language)}</Modal.Title>
          <Button variant="danger" onClick={handleViewModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Terminate
            handleViewModalClose={handleViewModalClose}
            staffId={EditData?.staff_id}
          />
        </Modal.Body>
      </Modal>
      {/* end terminate modal */}
    </>
  );
}

export default WorkExp;
