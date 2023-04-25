import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { planStoreUrl, industryUrlAll } from "config/index";
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
  IsFeatured,
  Label,
} from "component/UIElement/UIElement";
import Select from "react-select";

import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import MyEditor from "component/MyEditor";

const Create = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    saveFormData.industry_id = MultiSelectItem;

    POST(planStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
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
  const getModuleList = () => {
    const filterData2 = {
      api_token: apiToken,
    };
    POST(industryUrlAll, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          let arraySize = [];
          for (let idx = 0; idx < data.length; idx++) {
            arraySize.push({
              label: data[idx].industry_name,
              value: data[idx].industry_id,
            });
          }
          console.log("arraySize", arraySize);
          SetmoduleList(arraySize);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        // Notify(false, Trans(error.message, language));
      });
  };
  useEffect(() => {
    let abortController = new AbortController();
    getModuleList();
    return () => abortController.abort(); //getModuleList();
  }, []);

  const [MultiSelectItem, SetMultiSelectItem] = useState("");
  const handleMultiSelectChange = (newValue, actionMeta) => {
    console.log("newValue", newValue);
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    listArr = listArr.join(",");
    console.log("listArr", listArr);
    SetMultiSelectItem(listArr);
    console.log("actionMeta", actionMeta);
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
                id={Trans("PLAN_NAME", language)}
                label={Trans("PLAN_NAME", language)}
                placeholder={Trans("PLAN_NAME", language)}
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("plan_name", {
                  required: Trans("PLAN_NAME_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("DURATION", language)}
                type="number"
                label={Trans("DURATION", language)}
                placeholder={Trans("DURATION", language)}
                className="form-control"
                {...register("plan_duration", {
                  required: Trans("DURATION_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("AMOUNT", language)}
                type="number"
                label={Trans("AMOUNT", language)}
                placeholder={Trans("AMOUNT", language)}
                className="form-control"
                {...register("plan_amount", {
                  required: Trans("AMOUNT_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup>
              <Label>{Trans("PLAN_DESC", language)}</Label>
              <MyEditor
                setKey={`plan_desc`}
                updateFun={(Key, Value) => {
                  setValue(Key, Value);
                }}
              />
              <textarea
                {...register(`plan_desc`)}
                style={{ display: "none" }}
              ></textarea>
            </FormGroup>
          </Col>

          <Col col={6}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("DISCOUNT_TYPE", language)}
              >
                {Trans("DISCOUNT_TYPE", language)}
              </Label>
              <select
                {...register("discount_type")}
                defaultValue={0}
                className="form-control"
              >
                <option value="">{Trans("SELECT_DISCOUNT_TYPE")}</option>
                <option value={0}>{Trans("NO")}</option>
                <option value={1}>{Trans("FIXED")}</option>
                <option value={2}>{Trans("PERCENTAGE")}</option>
              </select>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("PLAN_DISCOUNT", language)}
                type="number"
                label={Trans("PLAN_DISCOUNT", language)}
                placeholder={Trans("PLAN_DISCOUNT", language)}
                className="form-control"
                {...register("plan_discount")}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <StatusSelect
                id={Trans("STATUS", language)}
                label={Trans("STATUS", language)}
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("status", {
                  required: Trans("STATUS_REQUIRED", language),
                })}
                defaultValue={1}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <IsFeatured
                id={Trans("IS_FEATURED", language)}
                label={Trans("IS_FEATURED", language)}
                className="form-control"
                {...register("featured", {
                  required: Trans("IS_FEATURED_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("INDUSTRY", language)}
              >
                {Trans("INDUSTRY", language)}
              </Label>
              <Select
                isMulti
                name="industry_id"
                options={moduleList}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleMultiSelectChange}
                required
              />
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

export default Create;
