import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { paymentTypeStoreUrl, fieldsgroupUrl } from "config/index";
import { useSelector, useDispatch } from "react-redux";
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

const AddProductType = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
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
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(paymentTypeStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, data, message } = response.data;
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

  const [moduleList, SetmoduleList] = useState([]);

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

export default AddProductType;
