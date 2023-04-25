import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { fieldsgroupUpdateUrl, fieldsgroupEditUrl } from "config/index";
import { useSelector, useDispatch } from "react-redux";
import { updateModuleListState } from "redux/slice/loginSlice";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  Label,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import { useEffect } from "react";

const EditFieldGroup = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(fieldsgroupUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });
          props.RefreshList();
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

    const setValueToField = async () => {
      const editInfo = {
        api_token: apiToken,
        fieldsgroup_id: props.editId,
      };
      await POST(fieldsgroupEditUrl, editInfo)
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
    };
    setValueToField();

    return () => abortController.abort();
  }, [props.editId]);

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
        <input type="hidden" value="" {...register("fieldsgroup_id")} />

        <Row>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("FIELDSGROUP_NAME", language)}
                label={Trans("FIELDSGROUP_NAME", language)}
                placeholder={Trans("FIELDSGROUP_NAME", language)}
                className="form-control"
                {...register("fieldsgroup_name", {
                  required: Trans("FIELDSGROUP_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="fieldsgroup_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("FIELDSGROUP_DESCRIPTION", language)}
                label={Trans("FIELDSGROUP_DESCRIPTION", language)}
                placeholder={Trans("FIELDSGROUP_DESCRIPTION", language)}
                className="form-control"
                {...register("fieldsgroup_description")}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SORT_ORDER", language)}
                type="number"
                label={Trans("SORT_ORDER", language)}
                placeholder={Trans("SORT_ORDER", language)}
                className="form-control"
                {...register("sort_order")}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="sort_order" />
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
  );
};

export default EditFieldGroup;
