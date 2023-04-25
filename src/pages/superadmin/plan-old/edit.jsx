import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { planUpdateUrl, planEditUrl, industryUrlAll } from "config/index";
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
  Label,
  IsFeatured,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import Select from "react-select";
import Loading from "component/Preloader";

const Edit = (props) => {
  console.log("edit props");
  console.log(props);

  const { editData } = props;

  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    saveFormData.industry_id = MultiSelectItem;

    console.log(saveFormData);
    POST(planUpdateUrl, saveFormData)
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

  const [moduleList, SetmoduleList] = useState([]);
  const [defaultSelectValue, SetDefaultSelectValue] = useState();

  useEffect(() => {
    let abortController = new AbortController();

    const setValueToField = () => {
      const editInfo = {
        api_token: apiToken,
        plan_id: editData,
      };
      POST(planEditUrl, editInfo)
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

          console.log("data.modules modules", data.plan_to_industry);
          const module = data.plan_to_industry;
          let selectedItem = [];
          if (module.length > 0) {
            for (let index = 0; index < module.length; index++) {
              selectedItem.push({
                label: module[index].industry_name,
                value: module[index].industry_id,
              });
            }
          }
          console.log("selectedItem", selectedItem);
          SetDefaultSelectValue(selectedItem);
        })
        .catch((error) => {
          console.log(error);
          SetloadingStatus(false);
          alert(error.message);
        });
    };
    setValueToField();

    const getModuleList = async () => {
      const filterData2 = {
        api_token: apiToken,
      };
      await POST(industryUrlAll, filterData2)
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

    getModuleList();
    return () => {
      // setValueToField();
      // getModuleList();
      abortController.abort();
    };
  }, [apiToken]);

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
            <input type="hidden" {...register("plan_id")} />
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
                <FormGroup mb="20px">
                  <TextArea
                    id={Trans("DESC", language)}
                    label={Trans("DESC", language)}
                    placeholder={Trans("DESC", language)}
                    hint="Enter text" // for bottom hint
                    className="form-control"
                    {...register("plan_desc", {
                      required: Trans("DESC_REQUIRED", language),
                    })}
                  />
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
                    {...register("discount_type", {
                      required: Trans("DISCOUNT_TYPE_REQUIRED", language),
                    })}
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
                    {...register("plan_discount", {
                      required: Trans("PLAN_DISCOUNT_REQUIRED", language),
                    })}
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
              {defaultSelectValue && (
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
                      defaultValue={defaultSelectValue}
                      options={moduleList}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleMultiSelectChange}
                      required
                    />
                  </FormGroup>
                </Col>
              )}
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
      )}
    </>
  );
};

export default Edit;
