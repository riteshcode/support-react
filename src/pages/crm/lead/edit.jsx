import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm, FormProvider } from "react-hook-form";
import { leadUpdateUrl, leadEditUrl, leadCreateUrl } from "config/index";
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
import Loading from "component/Preloader";
import { ErrorMessage } from "@hookform/error-message";
import MultipleContact from "./component/MultipleContact";
import SocialLink from "./component/SocialLink";

const Edit = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const [contactFill, SetContactFill] = useState([
    { contact_name: "", contact_email: "" },
  ]);

  const [socialLinkFill, SetSocialLinkFill] = useState([
    { social_type: "", social_link: "" },
  ]);

  const methods = useForm({
    defaultValues: {
      contact: contactFill,
      socialLink: socialLinkFill,
    },
  });

  console.log("methods", methods);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const { editData, source, industry, status, agent, country } = props;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(leadUpdateUrl, saveFormData)
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
        SetformloadingStatus(false);
        setError({
          status: true,
          msg: error.message,
          type: "danger",
        });
      });
  };

  // useEffect(() => {
  //   let abortController = new AbortController();

  //   return () => abortController.abort();
  // }, []);

  // selcted item
  const [selectedSource, SetSelectedSource] = useState("");
  // const [selectedIndustry, SetSelectedIndustry] = useState("");
  // const [selectedStatus, SetSelectedStatus] = useState("");
  // const [selectedAgent, SetSelectedAgent] = useState("");
  // const [selectedCountry, SetSelectedCountry] = useState("");

  const [selectedData, SetSelectedData] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();

    async function setValueToField() {
      const editInfo = {
        api_token: apiToken,
        lead_id: editData,
      };

      POST(leadEditUrl, editInfo)
        .then((response) => {
          SetloadingStatus(false);
          const { data } = response.data;
          SetSelectedData(data);
          const fieldList = getValues();
          for (const key in fieldList) {
            setValue(key, data[key]);
          }
          SetSelectedSource(data?.source_id);
          SetContactFill(data?.contact);
          SetSocialLinkFill(data?.socialLink);
          setValue("followup_id", data?.crm_lead_followup?.followup_id);
          setValue("followup_status", data?.crm_lead_followup?.followup_status);
          setValue("next_followup", data?.crm_lead_followup?.next_followup);
        })
        .catch((error) => {
          SetloadingStatus(false);
          Notify(false, Trans(error.message, language));
        });
    }
    setValueToField();
    return () => abortController.abort();
  }, [editData]);

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
          <FormProvider {...methods}>
            <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
              <input type="hidden" {...register("lead_id")} />
              <Row>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("SOURCE", language)}
                    >
                      {Trans("SOURCE", language)}
                    </Label>

                    <select
                      id={Trans("SOURCE", language)}
                      placeholder={Trans("SOURCE", language)}
                      className="form-control"
                      {...register("source_id", {
                        required: Trans("SOURCE_REQUIRED", language),
                      })}
                      defaultValue={selectedSource && selectedSource}
                    >
                      <option value="">
                        {Trans("SELECT_SOURCE", language)}
                      </option>
                      {source.map((curr) => (
                        <option value={curr.source_id} key={curr.source_id}>
                          {curr.source_name}
                        </option>
                      ))}
                    </select>

                    <span className="required">
                      <ErrorMessage errors={errors} name="source_id" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("INDUSTRY", language)}
                    >
                      {Trans("INDUSTRY", language)}
                    </Label>
                    <select
                      id={Trans("INDUSTRY", language)}
                      placeholder={Trans("INDUSTRY", language)}
                      className="form-control"
                      {...register("industry_id", {
                        required: Trans("INDUSTRY_REQUIRED", language),
                      })}
                    >
                      <option value="">
                        {Trans("SELECT_INDUSTRY", language)}
                      </option>
                      {industry &&
                        industry.map((curr) => (
                          <option
                            value={curr.industry_id}
                            key={curr.industry_id}
                          >
                            {curr.industry_name}
                          </option>
                        ))}
                    </select>

                    <span className="required">
                      <ErrorMessage errors={errors} name="industry_id" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("AGENT", language)}
                    >
                      {Trans("AGENT", language)}
                    </Label>
                    <select
                      id={Trans("AGENT", language)}
                      placeholder={Trans("AGENT", language)}
                      className="form-control"
                      {...register("agent_id", {
                        required: Trans("AGENT_REQUIRED", language),
                      })}
                    >
                      <option value="">
                        {Trans("SELECT_AGENT", language)}
                      </option>
                      {agent &&
                        agent.map((curr) => (
                          <option value={curr.agent_id} key={curr.agent_id}>
                            {curr.agent_alias}
                          </option>
                        ))}
                    </select>

                    <span className="required">
                      <ErrorMessage errors={errors} name="agent_id" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("PRIORITY", language)}
                    >
                      {Trans("PRIORITY", language)}
                    </Label>
                    <select
                      id={Trans("PRIORITY", language)}
                      placeholder={Trans("PRIORITY", language)}
                      className="form-control"
                      {...register("priority", {
                        required: Trans("PRIORITY_REQUIRED", language),
                      })}
                    >
                      <option value="">
                        {Trans("SELECT_PRIORITY", language)}
                      </option>
                      <option value={1}>{Trans("LOW", language)}</option>
                      <option value={2}>{Trans("MEDIUM", language)}</option>
                      <option value={3}>{Trans("HIGH", language)}</option>
                    </select>

                    <span className="required">
                      <ErrorMessage errors={errors} name="priority" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <input type="hidden" {...register("followup_id")} />
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("FOLLOW_UP_STATUS", language)}
                    >
                      {Trans("FOLLOW_UP_STATUS", language)}
                    </Label>
                    <select
                      id={Trans("FOLLOW_UP_STATUS", language)}
                      placeholder={Trans("FOLLOW_UP_STATUS", language)}
                      className="form-control"
                      {...register("followup_status", {
                        required: Trans("FOLLOW_UP_STATUS_REQUIRED", language),
                      })}
                    >
                      <option value="">
                        {Trans("SELECT_FOLLOW_UP_STATUS", language)}
                      </option>
                      {status &&
                        status.map((curr) => (
                          <option value={curr.status_id} key={curr.status_id}>
                            {curr.status_name}
                          </option>
                        ))}
                    </select>

                    <span className="required">
                      <ErrorMessage errors={errors} name="followup_status" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("FOLLOW_UP", language)}
                    >
                      {Trans("FOLLOW_UP", language)}
                    </Label>
                    <select
                      id={Trans("FOLLOW_UP", language)}
                      placeholder={Trans("FOLLOW_UP", language)}
                      className="form-control"
                      {...register("folllow_up", {
                        required: Trans("FOLLOW_UP_REQUIRED", language),
                      })}
                    >
                      <option value="">
                        {Trans("SELECT_FOLLOW_UP", language)}
                      </option>
                      <option value={1}>{Trans("YES", language)}</option>
                      <option value={2}>{Trans("NO", language)}</option>
                      {/* {sectionListing &&
                  sectionListing.map((curr) => (
                    <option value={curr.section_id} key={curr.section_id}>
                      {curr.section_name}
                    </option>
                  ))} */}
                    </select>

                    <span className="required">
                      <ErrorMessage errors={errors} name="folllow_up" />
                    </span>
                  </FormGroup>
                </Col>{" "}
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="FOLLOWUP_SCHEDULE"
                      label={Trans("FOLLOWUP_SCHEDULE", language)}
                      placeholder={Trans("FOLLOWUP_SCHEDULE", language)}
                      className="form-control"
                      {...register("next_followup", {
                        required: Trans("FOLOWUP_SCHEDULE_REQUIRED", language),
                      })}
                      type="date"
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name="next_followup" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="COMPANY_NAME"
                      label={Trans("COMPANY_NAME", language)}
                      placeholder={Trans("COMPANY_NAME", language)}
                      className="form-control"
                      {...register("company_name", {
                        required: Trans("COMPANY_NAME_REQUIRED", language),
                      })}
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name="company_name" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="COMPANY_PHONE"
                      label={Trans("COMPANY_PHONE", language)}
                      placeholder={Trans("COMPANY_PHONE", language)}
                      className="form-control"
                      {...register("phone", {
                        required: Trans("COMPANY_PHONE_REQUIRED", language),
                      })}
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name="phone" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="WEBSITE"
                      label={Trans("WEBSITE", language)}
                      placeholder={Trans("WEBSITE", language)}
                      className="form-control"
                      {...register("website", {
                        required: Trans("WEBSITE_REQUIRED", language),
                      })}
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name="website" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={12}>
                  <MultipleContact />
                </Col>
                <Col col={12}>
                  <SocialLink />
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="ADDRESS"
                      label={Trans("ADDRESS", language)}
                      placeholder={Trans("ADDRESS", language)}
                      className="form-control"
                      {...register("address", {
                        required: Trans("ADDRESS_REQUIRED", language),
                      })}
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name="address" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="CITY"
                      label={Trans("CITY", language)}
                      placeholder={Trans("CITY", language)}
                      className="form-control"
                      {...register("city", {
                        required: Trans("CITY_REQUIRED", language),
                      })}
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name="city" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="STATE"
                      label={Trans("STATE", language)}
                      placeholder={Trans("STATE", language)}
                      className="form-control"
                      {...register("state", {
                        required: Trans("STATE_REQUIRED", language),
                      })}
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name="state" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="ZIPCODE"
                      label={Trans("ZIPCODE", language)}
                      placeholder={Trans("ZIPCODE", language)}
                      className="form-control"
                      {...register("zipcode", {
                        required: Trans("ZIPCODE_REQUIRED", language),
                      })}
                      type="number"
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name="zipcode" />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("COUNTRY", language)}
                    >
                      {Trans("COUNTRY", language)}
                    </Label>
                    <select
                      id={Trans("COUNTRY", language)}
                      placeholder={Trans("COUNTRY", language)}
                      className="form-control"
                      {...register("countries_id", {
                        required: Trans("COUNTRY_REQUIRED", language),
                      })}
                    >
                      <option value="">
                        {Trans("SELECT_COUNTRY", language)}
                      </option>
                      {country &&
                        country.map((curr) => (
                          <option
                            value={curr.countries_id}
                            key={curr.countries_id}
                          >
                            {curr.countries_name}
                          </option>
                        ))}
                    </select>

                    <span className="required">
                      <ErrorMessage errors={errors} name="countries_id" />
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
          </FormProvider>
        </>
      )}
    </>
  );
};

export default Edit;
