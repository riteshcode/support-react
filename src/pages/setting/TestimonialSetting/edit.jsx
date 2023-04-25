import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  WebTestimonialUpdateUrl,
  WebTestimonialEditUrl,
  tempUploadFileUrl,
} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import Select from "react-select";

import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Label,
  StatusSelect,
  Input,
  TextArea,
} from "component/UIElement/UIElement";
import Loading from "component/Preloader";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";

const Edit = (props) => {
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
  console.log("editData", editData);

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(WebTestimonialUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });
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
            errObj.msg = message;
          }
          setError(errObj);
        }

        SetformloadingStatus(false);
      })
      .catch((error) => {
        console.log(error);
        SetformloadingStatus(false);
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
        testimonial_id: editData,
      };
      POST(WebTestimonialEditUrl, editInfo)
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
            <input type="hidden" {...register("testimonial_id")} />
            <Row>
              <Col col={12}>
                <FormGroup>
                  <Input
                    id={Trans("CUSTOMER_NAME", language)}
                    label={Trans("CUSTOMER_NAME", language)}
                    placeholder={Trans("CUSTOMER_NAME", language)}
                    className="form-control"
                    {...register("customer_name", {
                      required: Trans("CUSTOMER_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="customer_name" />
                  </span>
                </FormGroup>
              </Col>

              <Col col={12}>
                <FormGroup>
                  <Input
                    id={Trans("COMPANY_NAME", language)}
                    label={Trans("COMPANY_NAME", language)}
                    placeholder={Trans("COMPANY_NAME", language)}
                    className="form-control"
                    {...register("company_name", {
                      required: Trans("COMPANY_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="company_name" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup>
                  <Input
                    id={Trans("TESTIMONIAL_TITLE", language)}
                    label={Trans("TESTIMONIAL_TITLE", language)}
                    placeholder={Trans("TESTIMONIAL_TITLE", language)}
                    className="form-control"
                    {...register("testimonial_title", {
                      required: Trans("TESTIMONIAL_TITLE_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="testimonial_title" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup mb="20px">
                  <TextArea
                    id={`${Trans("TESTIMONIAL_TEXT", language)}`}
                    label={`${Trans("TESTIMONIAL_TEXT", language)}`}
                    placeholder={`${Trans("TESTIMONIAL_TEXT", language)}`}
                    hint="Enter text" // for bottom hint
                    className="form-control"
                    {...register(`testimonial_text`)}
                  />
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup mb="20px">
                  <StatusSelect
                    id="Status"
                    label={Trans("STATUS", language)}
                    hint="Enter text" // for bottom hint
                    className="form-control"
                    {...register("status", {
                      required: Trans("STATUS_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="status" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={12}>
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("SUBMIT", language)}
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
