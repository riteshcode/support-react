import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { webSettingGroupUpdateUrl, webSettingGroupEditUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";

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

    POST(webSettingGroupUpdateUrl, saveFormData)
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
        group_id: editData,
      };
      POST(webSettingGroupEditUrl, editInfo)
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
            <input type="hidden" {...register("group_id")} />

            <Row>
              <Col col={12}>
                <FormGroup>
                  <Input
                    id={Trans("GROUP", language)}
                    label={Trans("GROUP", language)}
                    placeholder={Trans("GROUP", language)}
                    className="form-control"
                    {...register("group_name", {
                      required: Trans("GROUP_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="method_name" />
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
