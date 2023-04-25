import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { supplierUpdateUrl, supplierEditUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  TextArea,
  StatusSelect,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import Loading from "component/Preloader";
import { ErrorMessage } from "@hookform/error-message";

const Edit = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const { editData } = props;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(supplierUpdateUrl, saveFormData)
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
            errObj.msg = message;
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
        supplier_id: editData,
      };

      POST(supplierEditUrl, editInfo)
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
    return () => abortController.abort();
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
            <input type="hidden" {...register("supplier_id")} />
            <Row>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id="SUPPLIER_NAME"
                    label={Trans("SUPPLIER_NAME", language)}
                    placeholder={Trans("SUPPLIER_NAME", language)}
                    className="form-control"
                    {...register("supplier_name", {
                      required: Trans("SUPPLIER_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="supplier_name" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id="ADDRESS"
                    label={Trans("ADDRESS", language)}
                    placeholder={Trans("ADDRESS", language)}
                    className="form-control"
                    {...register("supplier_address", {
                      required: Trans("SUPPLIER_ADDRESS_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="supplier_address" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id="CITY"
                    label={Trans("CITY", language)}
                    placeholder={Trans("CITY", language)}
                    className="form-control"
                    {...register("supplier_city", {
                      required: Trans("CITY_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="supplier_city" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id="STATE"
                    label={Trans("STATE", language)}
                    placeholder={Trans("STATE", language)}
                    className="form-control"
                    {...register("supplier_state", {
                      required: Trans("STATE_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="supplier_state" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id="COUNTRY"
                    label={Trans("COUNTRY", language)}
                    placeholder={Trans("COUNTRY", language)}
                    className="form-control"
                    {...register("supplier_country", {
                      required: Trans("COUNTRY_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="supplier_country" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
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
                  btnName={Trans("CREATE", language)}
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
