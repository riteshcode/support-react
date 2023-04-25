import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { fieldUpdateUrl, fieldsgroupUrl, fieldEditUrl } from "config/index";
import { useSelector } from "react-redux";
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

const EditFields = (props) => {
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
    handleSubmit,
    setValue,
    getValue,
    getValues,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(fieldUpdateUrl, saveFormData)
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

  const [moduleListing, SetModuleListing] = useState([]);

  const ModuleLoad = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(fieldsgroupUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetModuleListing(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    ModuleLoad();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    let abortController = new AbortController();

    const setValueToField = async () => {
      const editInfo = {
        api_token: apiToken,
        fields_id: props.editId,
      };
      await POST(fieldEditUrl, editInfo)
        .then((response) => {
          SetloadingStatus(false);
          const { data } = response.data;
          console.log("data", data);
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
        <input type="hidden" {...register("fields_id")} />
        <Row>
          <Col col={12}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("FIELD_GROUPS_NAME", language)}
              >
                {Trans("FIELD_GROUPS_NAME", language)}
              </Label>
              <select
                id={Trans("FIELD_GROUPS_NAME", language)}
                placeholder={Trans("FIELD_GROUPS_NAME", language)}
                className="form-control"
                {...register("fieldsgroup_id", {
                  required: Trans("FIELD_GROUPS_NAME_REQUIRED", language),
                })}
              >
                <option value="">
                  {Trans("SELECT_FIELD_GROUPS_NAME", language)}
                </option>
                {moduleListing &&
                  moduleListing.map((curr) => (
                    <option value={curr.value}>{curr.label}</option>
                  ))}
              </select>

              <span className="required">
                <ErrorMessage errors={errors} name="fieldsgroup_id" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("FIELD_TYPE", language)}
              >
                {Trans("FIELD_TYPE", language)}
              </Label>
              <select
                id={Trans("FIELD_TYPE", language)}
                placeholder={Trans("FIELD_TYPE", language)}
                className="form-control"
                {...register("field_type", {
                  required: Trans("FIELD_TYPE_REQUIRED", language),
                })}
                // defaultValue="input"
              >
                <option value="input">Input</option>
                <option value="select">Select</option>
                <option value="textarea">Textarea</option>
              </select>

              <span className="required">
                <ErrorMessage errors={errors} name="field_type" />
              </span>
            </FormGroup>
          </Col>

          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("FIELD_NAME", language)}
                label={Trans("FIELD_NAME", language)}
                placeholder={Trans("FIELD_NAME", language)}
                className="form-control"
                {...register("field_name", {
                  required: Trans("FIELD_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="field_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("FIELD_LABEL", language)}
                label={Trans("FIELD_LABEL", language)}
                placeholder={Trans("FIELD_LABEL", language)}
                className="form-control"
                {...register("field_label", {
                  required: Trans("FIELD_LABEL_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="field_label" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("FIELD_PLACEHOLDER", language)}
                label={Trans("FIELD_PLACEHOLDER", language)}
                placeholder={Trans("FIELD_PLACEHOLDER", language)}
                className="form-control"
                {...register("field_placeholder", {
                  required: Trans("FIELD_PLACEHOLDER_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="field_placeholder" />
              </span>
            </FormGroup>
          </Col>

          <Col col={6}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("FIELD_REQUIRED", language)}
              >
                {Trans("FIELD_REQUIRED", language)}
              </Label>
              <select
                id={Trans("FIELD_REQUIRED", language)}
                placeholder={Trans("FIELD_REQUIRED", language)}
                className="form-control"
                {...register("field_required", {
                  required: Trans("FIELD_REQUIRED_REQUIRED", language),
                })}
                defaultValue="no"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <span className="required">
                <ErrorMessage errors={errors} name="field_required" />
              </span>
            </FormGroup>
          </Col>

          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SORT_ORDER", language)}
                type="number"
                label={Trans("SORT_ORDER", language)}
                placeholder={Trans("SORT_ORDER", language)}
                className="form-control"
                {...register("sort_order", {
                  required: Trans("SORT_ORDER_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="sort_order" />
              </span>
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("FIELD_OPTIONS", language)}
                label={Trans("FIELD_OPTIONS_ONLY_FOR_SELECT", language)}
                placeholder={Trans(
                  "FIELD_OPTIONS_WITH_COMMA_SEPERATE",
                  language
                )}
                className="form-control"
                {...register("field_options")}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="FIELD_OPTIONS" />
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

export default EditFields;
