import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { languageUpdateUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";

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
  const { register, handleSubmit, getValues, setValue } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(languageUpdateUrl, saveFormData)
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

  const { data } = props;

  useEffect(() => {
    function setValueToField() {
      const fieldList = getValues();
      for (const key in fieldList) {
        console.log(key, data[key]);
        setValue(key, data[key]);
      }
    }
    setValueToField();
    return () => {
      setValueToField();
    };
  }, []);

  return (
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
        <input type="hidden" {...register("languages_id")} />
        <Row>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="languagename"
                label={Trans("NAME", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("languages_name", {
                  required: "Language name is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="language_code"
                type="text"
                label={Trans("CODE", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("languages_code", {
                  required: "Language short code is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id="icon"
                type="text"
                label={Trans("ICON", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("languages_icon")}
              />
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
  );
};

export default Edit;
