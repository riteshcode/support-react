import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm, useFieldArray } from "react-hook-form";
import { WebSettingStoreUrl, WebSettingCreateUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Label,
  Input,
} from "component/UIElement/UIElement";
import { ErrorMessage } from "@hookform/error-message";
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
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      productAttribute: [
        { options_id: "", options_values_id: "", options_values_price: "" },
      ],
    },
  });

  const productAttributeFields = useFieldArray({
    control,
    name: "productAttribute",
  });

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;
    POST(WebSettingStoreUrl, formData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });
          props.handleModalClose();
          props.loadSettingData();
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
              console.log(message[key][0]);
              errMsg += Trans(message[key][0], language);
              return errMsg;
            });
            errObj.msg = errMsg;
          } else {
            errObj.msg = Trans(message, language);
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

  const [sectionListing, SetSectionListing] = useState([]);

  const ModuleLoad = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(WebSettingCreateUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetSectionListing(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    ModuleLoad();
    return () => abortController.abort();
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
                htmlFor={Trans("SECTION", language)}
              >
                {Trans("GROUP", language)}
              </Label>
              <select
                id={Trans("SECTION", language)}
                placeholder={Trans("SECTION", language)}
                className="form-control"
                {...register("group_id", {
                  required: Trans("SECTION_REQUIRED", language),
                })}
              >
                <option value="">{Trans("SELECT_GROUP", language)}</option>
                {sectionListing &&
                  sectionListing.map((curr, idx) => (
                    <option value={curr.group_id} key={idx}>
                      {curr.group_name}
                    </option>
                  ))}
              </select>
              <span className="required">
                <ErrorMessage errors={errors} name="group_id" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SETTING_KEYS", language)}
                label={Trans("SETTING_KEYS", language)}
                placeholder="For Multiple (ABC,BCD) use comma seperate"
                className="form-control"
                {...register("setting_key", {
                  required: Trans("KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="setting_key" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SETTING_NAME", language)}
                label={Trans("SETTING_NAME", language)}
                placeholder="For Multiple (ABC,BCD) use comma seperate"
                className="form-control"
                {...register("setting_name", {
                  required: Trans("KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="setting_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SETTING_VALUE", language)}
                label={Trans("SETTING_VALUE", language)}
                placeholder="For Multiple (ABC,BCD) use comma seperate"
                className="form-control"
                {...register("setting_value", {
                  required: Trans("KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="setting_value" />
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
