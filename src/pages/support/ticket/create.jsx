import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { TicketStoreUrl, TicketCreateUrl } from "config/index";
import { useSelector } from "react-redux";
import MyEditor from "component/MyEditor";
import { ErrorMessage } from "@hookform/error-message";

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
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(TicketStoreUrl, saveFormData)
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
      language: language,
    };
    POST(TicketCreateUrl, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetmoduleList(data.type_list);
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
            <FormGroup>
              <Label>{`${Trans("TICKETS_SUBJECT", language)}`}</Label>
              <MyEditor
                setKey={`subject`}
                updateFun={(Key, Value) => {
                  setValue(Key, Value);
                }}
              />
              <textarea
                {...register(`subject`)}
                style={{ display: "none" }}
              ></textarea>
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup mb="20px">
              <TextArea
                id={Trans("TICKET_DESCRIPTION", language)}
                label={Trans("TICKET_DESCRIPTION", language)}
                placeholder={Trans("TICKET_DESCRIPTION", language)}
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("message", {
                  required: Trans("TICKET_DESCRIPTION_REQUIRED", language),
                })}
              />
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("PRIORITY", language)}
              >
                {Trans("PRIORITY", language)}
              </Label>
              <select
                {...register("priority", {
                  required: Trans("PRIORITY_REQUIRED", language),
                })}
                className="form-control"
              >
                <option value="">{Trans("SELECT_PRIORITY")}</option>
                <option value="low">{Trans("low")}</option>
                <option value="medium">{Trans("medium")}</option>
                <option value="high">{Trans("high")}</option>
                <option value="urgent">{Trans("urgent")}</option>
              </select>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("TICKET_TYPE", language)}
              >
                {Trans("TICKET_TYPE", language)}
              </Label>
              <select
                id={Trans("TICKET_TYPE", language)}
                placeholder={Trans("TICKET_TYPE", language)}
                className="form-control"
                {...register("type_id")}
              >
                <option value={0}>
                  {Trans("SELECT_TICKET_TYPE", language)}
                </option>
                {moduleList &&
                  moduleList.map((curr) => (
                    <React.Fragment key={curr.id}>
                      <option value={curr.id}>{curr.type}</option>
                    </React.Fragment>
                  ))}
              </select>
              <span className="required">
                <ErrorMessage errors={errors} name="main_category" />
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
