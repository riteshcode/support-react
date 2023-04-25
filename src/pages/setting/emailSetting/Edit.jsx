import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { EmailTemplateUpdateUrl, EmailTemplateEditUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  TextArea,
  Label,
  Input,
} from "component/UIElement/UIElement";
import { ErrorMessage } from "@hookform/error-message";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import MyEditor from "component/MyEditor";

const Edit = (props) => {
  const { editData } = props;

  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [key, setKey] = useState("en");
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;
    POST(EmailTemplateUpdateUrl, formData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });
          props.handleModalClose();
          props.filterItem();
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
              console.log(message[key][0]);
              errMsg += Trans(message[key][0], language);
              return errMsg;
            });
            errObj.msg = errMsg;
          } else {
            errObj.msg = Trans(message, language);
          }
          setError(errObj);
        }
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

  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const [editorData, SeteditorData] = useState("");

  const setValueToField = () => {
    const editInfo = {
      api_token: apiToken,
      template_id: editData,
    };

    POST(EmailTemplateEditUrl, editInfo)
      .then((response) => {
        SetloadingStatus(false);
        const { data } = response.data;
        const fieldList = getValues();
        for (const key in fieldList) {
          setValue(key, data[key]);
        }

        SeteditorData(data["template_content"]);
      })
      .catch((error) => {
        SetloadingStatus(false);
        Notify(false, error.message);
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    setValueToField();
    return () => abortController.abort();
  }, []);

  return (
    <React.Fragment>
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
        <input type="hidden" {...register("template_id")} />
        <input
          type="hidden"
          {...register("group_id")}
          defaultValue={props.groupId}
        />
        <Row>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("TEMPLATE_SUBJECT", language)}
                label={Trans("TEMPLATE_SUBJECT", language)}
                placeholder={Trans("TEMPLATE_SUBJECT", language)}
                className="form-control"
                {...register("template_subject", {
                  required: Trans("TEMPLATE_SUBJECT_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="template_subject" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup>
              <Label>{Trans("TEMPLATE_CONTENT", language)}</Label>
              <MyEditor
                setKey={`template_content`}
                setVal={editorData}
                updateFun={(Key, Value) => {
                  setValue(Key, Value);
                }}
              />
              <textarea
                {...register(`template_content`, {
                  required: Trans("TEMPLATE_CONTENT_REQUIRED", language),
                })}
                style={{ display: "none" }}
              ></textarea>
              <span className="required" style={{ marginTop: "10px" }}>
                <ErrorMessage errors={errors} name="template_content" />
              </span>

              <span className="info">
                USER: ( [CUSTOMER_NAME], [CUSTOMER_EMAIL], [CUSTOMER_PHONE])
                <br />
                ORDER: ( [ORDER_NUMBER], [ORDER_SHIPPING], [ORDER_BILLING],
                [ORDER_ITEM] )
              </span>
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
