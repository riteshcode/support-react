import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { supplierStoreUrl, CountryCreateList } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  TextArea,
  StatusSelect,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import { useEffect } from "react";
import Select from "react-select";

const Create = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [moduleList, SetmoduleList] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(supplierStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          props.handleModalClose();
          Notify(true, Trans(message, language));
          props.filterItem("refresh", "", "");
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
  const getModuleList = () => {
    const filterData2 = {
      api_token: apiToken,
    };
    POST(CountryCreateList, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetmoduleList(data.country_list);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getModuleList();
    return () => abortController.abort(); //getModuleList();
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
        <Row>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="SUPPLIER_NAME"
                label={Trans("SUPPLIER_NAME", language)}
                placeholder={Trans("SUPPLIER_NAME", language)}
                className="form-control"
                {...register("supplier_name", {
                  required: Trans("SUPPLIER_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="supplier_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="ADDRESS"
                label={Trans("ADDRESS", language)}
                placeholder={Trans("ADDRESS", language)}
                className="form-control"
                {...register("supplier_address", {
                  required: Trans("SUPPLIER_ADDRESS_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="supplier_address" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="CITY"
                label={Trans("CITY", language)}
                placeholder={Trans("CITY", language)}
                className="form-control"
                {...register("supplier_city", {
                  required: Trans("CITY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="supplier_city" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="STATE"
                label={Trans("STATE", language)}
                placeholder={Trans("STATE", language)}
                className="form-control"
                {...register("supplier_state", {
                  required: Trans("STATE_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="supplier_state" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                type="hidden"
                id={Trans("COUNTRY", language)}
                label={Trans("COUNTRY", language)}
                placeholder={Trans("COUNTRY", language)}
                className="form-control"
                {...register("supplier_country", {
                  required: Trans("CHOOSE_COUNTRY_REQUIRED", language),
                })}
              />

              <Select
                is
                name={Trans("COUNTRY", language)}
                options={moduleList}
                className="basic-select"
                classNamePrefix="select"
                onChange={(newValue, actionMeta) => {
                  setValue("supplier_country", newValue.value);
                }}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="supplier_country" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <StatusSelect
                id="Status"
                label={Trans("STATUS", language)}
                hint="Enter text" // for bottom hint
                defaultValue={1}
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
          <Col col={12}>
            <LoaderButton
              formLoadStatus={formloadingStatus}
              btnName={Trans("CREATE", language)}
              className="btn btn-primary btn-block"
            />
          </Col>
        </Row>
      </form>
    </>
  );
};

export default Create;
