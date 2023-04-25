import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  TaxGroupSettingStoreUrl,
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
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";
import { useEffect } from "react";

const Create = (props) => {
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
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);

    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    saveFormData.tax = MultiSelectItem;

    POST(TaxGroupSettingStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
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
      POST(TaxGroupSettingCreateUrl, filterData2)
        .then((response) => {
          const { status, data, message } = response.data;
          if (status) {
            SetmoduleList(data.tax);
          } else Notify(false, Trans(message, language));
        })
        .catch((error) => {
          Notify(false, Trans(error.message, language));
        });
    };
    getModuleList();
    return () => abortController.abort(); //getModuleList();
  }, [apiToken, language]);

  const [MultiSelectItem, SetMultiSelectItem] = useState("");
  const handleMultiSelectChange = (newValue, actionMeta) => {
    console.log("newValue", newValue);
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    // listArr = listArr.join(",");
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

          <Col col={12}>
            <FormGroup mb="20px">
              <Label display="block" mb="5px" htmlFor={Trans("TAX", language)}>
                {Trans("TAX", language)}
              </Label>
              <Select
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
