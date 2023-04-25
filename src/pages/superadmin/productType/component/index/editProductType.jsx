import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  paymentTypeUpdateUrl,
  fieldsgroupUrl,
  paymentTypeEditUrl,
} from "config/index";
import Loading from "component/Preloader";

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
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";

const EditProductType = (props) => {
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
    getValues,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(paymentTypeUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
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

  const [moduleList, SetmoduleList] = useState([]);
  const [defaultSelectValue, SetDefaultSelectValue] = useState();

  useEffect(() => {
    let abortController = new AbortController();
    const getModuleList = () => {
      const filterData2 = {
        api_token: apiToken,
      };
      POST(fieldsgroupUrl, filterData2)
        .then((response) => {
          const { status, data, message } = response.data;
          if (status) {
            SetmoduleList(data);
          } else Notify(false, Trans(message, language));
        })
        .catch((error) => {
          Notify(false, Trans(error.message, language));
        });
    };
    getModuleList();
    return () => abortController.abort(); //getModuleList();
  }, [apiToken, language]);

  const handleMultiSelectChange = (newValue) => {
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    listArr = listArr.join(",");
    setValue("fields_group", listArr);
  };

  useEffect(() => {
    let abortController = new AbortController();

    const setValueToField = async () => {
      const editInfo = {
        api_token: apiToken,
        product_type_id: props.editId,
      };
      await POST(paymentTypeEditUrl, editInfo)
        .then((response) => {
          SetloadingStatus(false);
          const { data } = response.data;
          console.log("data", data);
          const fieldList = getValues();
          for (const key in fieldList) {
            console.log(key, data[key]);
            setValue(key, data[key]);
          }
          //setting edit info to show select value

          console.log("data.modules modules", data.modules);
          const fields_group = data.fields_group;
          let selectedItem = [];
          let listArr = [];
          if (fields_group.length > 0) {
            for (let index = 0; index < fields_group.length; index++) {
              selectedItem.push({
                label: fields_group[index].fieldsgroup_name,
                value: fields_group[index].fieldsgroup_id,
              });
              listArr[index] = fields_group[index].fieldsgroup_id;
            }
          }
          console.log("selectedItem", selectedItem);
          SetDefaultSelectValue(selectedItem);

          listArr = listArr.join(",");
          setValue("fields_group", listArr);
        })
        .catch((error) => {
          console.log(error);
          SetloadingStatus(false);
          alert(error.message);
        });
    };
    setValueToField();

    return () => {
      abortController.abort();
    };
  }, [apiToken]);

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
            <input type="hidden" {...register("product_type_id")} />
            <Row>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("PRODUCT_TYPE_NAME", language)}
                    label={Trans("PRODUCT_TYPE_NAME", language)}
                    placeholder={Trans("PRODUCT_TYPE_NAME", language)}
                    className="form-control"
                    {...register("product_type_name", {
                      required: Trans("PRODUCT_TYPE_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="product_type_name" />
                  </span>
                </FormGroup>
              </Col>

              {defaultSelectValue && (
                <Col col={12}>
                  <input
                    type="hidden"
                    {...register("fields_group", {
                      required: Trans("FIELDS_GROUP_REQUIRED", language),
                    })}
                  />
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("FieldsGroup", language)}
                    >
                      {Trans("FieldsGroup", language)}
                    </Label>

                    <Select
                      isMulti
                      defaultValue={defaultSelectValue}
                      name={Trans("FieldsGroup", language)}
                      options={moduleList}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleMultiSelectChange}
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name="fields_group" />
                    </span>
                  </FormGroup>
                </Col>
              )}

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

export default EditProductType;
