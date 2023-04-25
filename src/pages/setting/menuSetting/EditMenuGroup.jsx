import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { MenuGroupUpdateUrl, MenuGroupEditUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
} from "component/UIElement/UIElement";
import { ErrorMessage } from "@hookform/error-message";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";

const EditMenuGroup = (props) => {
  const { editData } = props;

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
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;
    POST(MenuGroupUpdateUrl, formData)
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
          props.loadSettingData();
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

  function setValueToField() {
    const editInfo = {
      api_token: apiToken,
      group_id: editData,
    };

    POST(MenuGroupEditUrl, editInfo)
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
        SetloadingStatus(false);
        Notify(false, error.message);
      });
  }
  // update
  useEffect(() => {
    let abortController = new AbortController();
    setValueToField();
    return () => abortController.abort();
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
        <input type="hidden" {...register("group_id")} />
        <Row>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("GROUP_NAME", language)}
                label={Trans("GROUP_NAME", language)}
                placeholder={Trans("GROUP_NAME", language)}
                className="form-control"
                {...register("group_name", {
                  required: Trans("GROUP_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="group_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("GROUP_POSITION", language)}
                label={Trans("GROUP_POSITION", language)}
                placeholder={Trans("GROUP_POSITION", language)}
                className="form-control"
                {...register("group_position", {
                  required: Trans("GROUP_POSITION_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="group_position" />
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
    </>
  );
};

export default EditMenuGroup;
