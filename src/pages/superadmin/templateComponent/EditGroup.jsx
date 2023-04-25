import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { TemplateComponentUpdateUrl, TemplateComponentEditUrl,TemplateComponentCreateUrl } from "config/index";
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
import Loading from "component/Preloader";
import { ErrorMessage } from "@hookform/error-message";

const EditGroup = (props) => {
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
  const [getComponentList, setComponentList] = useState();


  const { editData } = props;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(TemplateComponentUpdateUrl, saveFormData)
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
        component_id: editData,
      };

      POST(TemplateComponentEditUrl, editInfo)
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

  React.useEffect(() => {
    let abortController = new AbortController();

    const saveFormData = {};
    saveFormData.api_token = apiToken;

    POST(TemplateComponentCreateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, data, message } = response.data;
        // console.log("data", data);
        setComponentList(data);
      })
      .catch((error) => {
        console.log(error);
        Notify(false, error.message);
      });
    return () => {};
  }, []);

  return (
    <React.Fragment>
      {contentloadingStatus ? (
        <Loading />
      ) : (
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
            <input type="hidden" {...register("component_id")} />
            <Row>
          <Col col={12}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("CATEGORY", language)}
              >
                {Trans("CATEGORY", language)}
              </Label>
              <select
                id={Trans("CATEGORY", language)}
                placeholder={Trans("CATEGORY", language)}
                className="form-control"
                {...register("parent_id")}
              >
                <option value={0}>
                  {Trans("SELECT_PARENT_COMPONENT", language)}
                </option>
                {getComponentList &&
                  getComponentList.map((curr) => (
                    <React.Fragment key={curr.component_id}>
                      <option value={curr.component_id}>
                        {curr.component_name}
                      </option>
                    </React.Fragment>
                  ))}
              </select>
              <span className="required">
                <ErrorMessage errors={errors} name="main_category" />
              </span>
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id="COMPONENT_NAME"
                label={Trans("COMPONENT_NAME", language)}
                placeholder={Trans("COMPONENT_NAME", language)}
                className="form-control"
                {...register("component_name", {
                  required: Trans("COMPONENT_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="component_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id="COMPONENT_KEY"
                label={Trans("COMPONENT_KEY", language)}
                placeholder={Trans("COMPONENT_KEY", language)}
                className="form-control"
                {...register("component_key", {
                  required: Trans("COMPONENT_KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="component_key" />
              </span>
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
              <Label htmlFor="status">{Trans("STATUS", language)} : </Label>
              {"     "}
              <input
                type="radio"
                {...register("status")}
                defaultValue={1}
                defaultChecked={true}
              />
              {"  "}
              {Trans("ACTIVE", language)}
              {"   "}
              <input
                type="radio"
                {...register("status")}
                defaultValue={0}
              />{" "}
              {Trans("INACTIVE", language)}
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
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default EditGroup;
