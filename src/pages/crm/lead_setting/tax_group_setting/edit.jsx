import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  TaxGroupSettingUpdateUrl,
  TaxGroupSettingEditUrl,
  TaxGroupSettingCreateUrl,
} from "config/index";
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
import Loading from "component/Preloader";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";
import { useEffect } from "react";

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

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    saveFormData.tax = MultiSelectItem;

    POST(TaxGroupSettingUpdateUrl, saveFormData)
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

  const [moduleList, SetmoduleList] = useState([]);
  const [defaultSelectValue, SetDefaultSelectValue] = useState();

  useEffect(() => {
    let abortController = new AbortController();

    const setValueToField = async () => {
      const editInfo = {
        api_token: apiToken,
        tax_group_id: editData,
      };
      await POST(TaxGroupSettingEditUrl, editInfo)
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

          console.log("data.modules modules", data.tax_info);
          const module = data.tax_info;
          let selectedItem = [];
          let listArr = [];
          if (module.length > 0) {
            for (let index = 0; index < module.length; index++) {
              selectedItem.push({
                label: module[index].tax_name,
                value: module[index].tax_id,
              });
              listArr[index] = module[index].module_id;
            }
          }
          console.log("selectedItem", selectedItem);
          SetDefaultSelectValue(selectedItem);

          // listArr = listArr.join(",");
          SetMultiSelectItem(listArr);
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
      await POST(TaxGroupSettingCreateUrl, filterData2)
        .then((response) => {
          const { status, data, message } = response.data;
          if (status) {
            console.log("getModuleList", data);
            console.log("getModuleList defaultSelectValue", defaultSelectValue);

            SetmoduleList(data.tax);
          } else Notify(false, Trans(message, language));
        })
        .catch((error) => {
          console.error("There was an error!", error);
          // Notify(false, Trans(error.message, language));
        });
    };

    getModuleList();
    return () => {
      abortController.abort();
    };
  }, [apiToken]);

  const [MultiSelectItem, SetMultiSelectItem] = useState("");
  const handleMultiSelectChange = (newValue, actionMeta) => {
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    // listArr = listArr.join(",");
    SetMultiSelectItem(listArr);
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
            <input type="hidden" {...register("tax_group_id")} />
            <Row>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("TAX_GROUP_NAME", language)}
                    label={Trans("TAX_GROUP_NAME", language)}
                    placeholder={Trans("TAX_GROUP_NAME", language)}
                    className="form-control"
                    {...register("tax_group_name", {
                      required: Trans("TAX_GROUP_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="tax_group_name" />
                  </span>
                </FormGroup>
              </Col>

              {defaultSelectValue && (
                <Col col={12}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("TAX", language)}
                    >
                      {Trans("TAX", language)}
                    </Label>
                    <Select
                      defaultValue={defaultSelectValue}
                      isMulti
                      name={Trans("TAX", language)}
                      options={moduleList}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleMultiSelectChange}
                      placeholder="Select tax..."
                    />
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

export default Edit;
