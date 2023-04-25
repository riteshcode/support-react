import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { industryCategoryStoreUrl, industryCategoryList } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  StatusSelect,
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
    setValue,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);

    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(industryCategoryStoreUrl, saveFormData)
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

  const [industryList, SetindustryList] = useState([]);

  const getModuleList = () => {
    const filterData2 = {
      api_token: apiToken,
    };
    POST(industryCategoryList, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetindustryList(data);
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
          <Col col={12}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("INDUSTRY", language)}
              >
                {Trans("INDUSTRY", language)}
              </Label>
              <select
                {...register("industry_id", {
                  required: Trans("INDUSTRY_REQUIRED", language),
                })}
                className="form-control"
              >
                <option>{Trans("SELECT_INDUSTRY")}</option>
                {industryList &&
                  industryList.map((industry, idx) => {
                    return (
                      <option value={industry.industry_id} key={idx}>
                        {industry.industry_name}
                      </option>
                    );
                  })}
              </select>
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                type="text"
                id={Trans("INDUSTRY_CATEGORY_NAME", language)}
                label={Trans("INDUSTRY_CATEGORY_NAME", language)}
                placeholder={Trans("INDUSTRY_CATEGORY_NAME", language)}
                className="form-control"
                {...register("industry_category_name", {
                  required: Trans("INDUSTRY_CATEGORY_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="industry_category_name" />
              </span>
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                type="text"
                id={Trans("DEMO_DB", language)}
                label={Trans("DEMO_DB", language)}
                placeholder={Trans("DEMO_DB", language)}
                className="form-control"
                {...register("demo_db")}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("DEMO_URL", language)}
                label={Trans("DEMO_URL", language)}
                placeholder={Trans("DEMO_URL", language)}
                className="form-control"
                {...register("demo_url")}
                defaultValue="#"
              />
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                type="number"
                id={Trans("SORT_ORDER", language)}
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
