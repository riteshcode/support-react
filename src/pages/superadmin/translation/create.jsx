import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { translationStoreKeysUrl, moduleUrlAll } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Label,
  TextArea,
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
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;
    POST(translationStoreKeysUrl, formData)
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
          props.getData();
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

  const ModuleChange = (e) => {
    let value = e.target.value;
    const sectionLis = value.split("::");
    setValue("module_id", sectionLis[0]);
    SetSectionListing(JSON.parse(sectionLis[1]));
  };

  const [moduleListing, SetModuleListing] = useState([]);
  const [sectionListing, SetSectionListing] = useState([]);

  const ModuleLoad = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(moduleUrlAll, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetModuleListing(data);
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

  const [defaultType, SetdefaultType] = useState("plain");
  const [sourceType, SetSourceType] = useState(1);

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
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("SOURCE_TYPE", language)}
              >
                {Trans("SOURCE_TYPE", language)}{" "}
                <span className="required">*</span>
              </Label>
              <select
                id={Trans("SOURCE_TYPE", language)}
                className="form-control"
                {...register("source")}
                onChange={(event) => {
                  SetSourceType(event.target.value);
                }}
                defaultValue={sourceType}
              >
                <option value="1">Backend</option>
                <option value="2">Website</option>
                <option value="3">Landing</option>
              </select>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup>
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("KEY_TYPE", language)}
              >
                {Trans("KEY_TYPE", language)}{" "}
              </Label>
              <select
                id={Trans("KEY_TYPE", language)}
                className="form-control"
                {...register("KEY_TYPE")}
                onChange={(event) => {
                  SetdefaultType(event.target.value);
                }}
                defaultValue={defaultType}
              >
                {sourceType === 1 ? (
                  <>
                    <option value="plain">Default</option>
                    <option value="section">Section</option>
                  </>
                ) : (
                  <>
                    <option value="plain">Default</option>
                  </>
                )}
              </select>
            </FormGroup>
          </Col>

          {defaultType === "plain" ? (
            <>
              <input type="hidden" {...register("section_id")} />
            </>
          ) : (
            <>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("MODULE", language)}
                  >
                    {Trans("MODULE", language)}
                  </Label>
                  <select
                    id={Trans("MODULE", language)}
                    placeholder={Trans("MODULE", language)}
                    className="form-control"
                    onChange={(e) => {
                      ModuleChange(e);
                    }}
                  >
                    <option value="">{Trans("SELECT_MODULE", language)}</option>
                    {moduleListing &&
                      moduleListing.map((curr) => (
                        <option
                          value={`${curr.module_id}::${JSON.stringify(
                            curr.menu
                          )}`}
                          key={curr.module_id}
                        >
                          {curr.module_name}
                        </option>
                      ))}
                  </select>

                  <span className="required">
                    <ErrorMessage errors={errors} name="module_id" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("SECTION", language)}
                  >
                    {Trans("SECTION", language)}
                  </Label>
                  <select
                    id={Trans("SECTION", language)}
                    placeholder={Trans("SECTION", language)}
                    className="form-control"
                    {...register("section_id", {
                      required: Trans("SECTION_REQUIRED", language),
                    })}
                  >
                    <option value="">
                      {Trans("SELECT_SECTION", language)}
                    </option>
                    {sectionListing &&
                      sectionListing.map((curr) => (
                        <option value={curr.section_id} key={curr.section_id}>
                          {curr.section_name}
                        </option>
                      ))}
                  </select>
                  <span className="required">
                    <ErrorMessage errors={errors} name="section_id" />
                  </span>
                </FormGroup>
              </Col>
            </>
          )}

          <Col col={12}>
            <FormGroup mb="20px">
              <TextArea
                id={Trans("TRANSLATION_KEYS", language)}
                label={Trans("TRANSLATION_KEYS", language)}
                placeholder="For Multiple (ABC,BCD) use comma seperate"
                className="form-control"
                {...register("lang_key", {
                  required: Trans("KEY_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="lang_key" />
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
