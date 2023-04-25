import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { FeaturedGroupUpdateUrl, FeaturedGroupEditUrl } from "config/index";
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

  const { editData } = props;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(FeaturedGroupUpdateUrl, saveFormData)
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
        featured_group_id: editData,
      };

      POST(FeaturedGroupEditUrl, editInfo)
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
            <input type="hidden" {...register("featured_group_id")} />
            <Row>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    id="GROUP_NAME"
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
                    id="BRAND_NAME"
                    label={Trans("GROUP_TITLE", language)}
                    placeholder={Trans("GROUP_TITLE", language)}
                    className="form-control"
                    {...register("group_title", {
                      required: Trans("GROUP_TITLE_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="group_title" />
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
                  btnName={Trans("UPDATE", language)}
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
