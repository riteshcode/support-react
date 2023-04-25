import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { moduleEditUrl, moduleUpdateUrl } from "config/index";
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
import Loading from "component/Preloader";

const ModuleEdit = (props) => {
  const dispatch = useDispatch();
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

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(moduleUpdateUrl, saveFormData)
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
          // update side module and section
          dispatch(updateModuleListState(data));
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
    function setValueToField() {
      const editInfo = {
        api_token: apiToken,
        module_id: props.editId,
      };
      POST(moduleEditUrl, editInfo)
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
  }, [props.editId]);

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
            <input type="hidden" {...register("module_id")} />

            <Row>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("MODULE_NAME", language)}
                    label={Trans("MODULE_NAME", language)}
                    placeholder={Trans("MODULE_NAME", language)}
                    className="form-control"
                    {...register("module_name", {
                      required: Trans("MODULE_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="module_name" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("MODULE_ICON", language)}
                    label={Trans("MODULE_ICON", language)}
                    placeholder={Trans("MODULE_ICON", language)}
                    className="form-control"
                    {...register("module_icon")}
                  />
                  <span className="required">
                    <a
                      href="https://feathericons.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Search Module Icons
                    </a>
                    <ErrorMessage errors={errors} name="module_icon" />
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
                      required: Trans("SORT_ORDER", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="sort_order" />
                  </span>
                </FormGroup>
              </Col>

              <Col col={12}>
                <FormGroup mb="20px">
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("ACCESS_PRIVILLAGE", language)}
                  >
                    {Trans("ACCESS_PRIVILLAGE", language)}
                  </Label>
                  <select
                    id={Trans("ACCESS_PRIVILLAGE", language)}
                    placeholder={Trans("ACCESS_PRIVILLAGE", language)}
                    className="form-control"
                    {...register("access_priviledge", {
                      required: Trans("ACCESS_PRIVILLAGE_REQUIRED", language),
                    })}
                  >
                    <option value="0">{Trans("SUPER_ADMIN", language)}</option>
                    <option value="1">{Trans("ALL", language)}</option>
                    <option value="2">{Trans("Subscriber", language)}</option>
                  </select>

                  <span className="required">
                    <ErrorMessage errors={errors} name="access_priviledge" />
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

export default ModuleEdit;
