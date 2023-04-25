import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm, FormProvider } from "react-hook-form";
import { leadFollowUpStoreUrl, leadViewUrl } from "config/index";
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
import { Alert, Card, Button } from "react-bootstrap";
import Notify from "component/Notify";
import Loading from "component/Preloader";
import { ErrorMessage } from "@hookform/error-message";

const View = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const methods = useForm();

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
    POST(leadFollowUpStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          //   props.filterItem("refresh", "", "");
          //   props.handleModalClose();
          setValueToField();
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

  // selcted item

  const [editDataInfo, SetEditDataInfo] = useState([]);
  const setValueToField = () => {
    const editInfo = {
      api_token: apiToken,
      lead_id: editData,
    };

    POST(leadViewUrl, editInfo)
      .then((response) => {
        SetloadingStatus(false);
        const { data } = response.data;
        SetEditDataInfo(data);
      })
      .catch((error) => {
        SetloadingStatus(false);
        Notify(false, Trans(error.message, language));
      });
  };
  useEffect(() => {
    let abortController = new AbortController();

    setValueToField();
    return () => abortController.abort();
  }, [editData]);

  const [newHistory, SetnewHistory] = useState(false);

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
          <Row>
            <Col col={6}>
              <p>
                <span>
                  <b>{Trans("COMPANY_NAME")}</b>
                </span>{" "}
                : {editDataInfo?.company_name}
              </p>
              <p>
                <span>
                  <b>{Trans("PHONE")}</b>
                </span>{" "}
                : {editDataInfo?.phone}
              </p>
              <p>
                <span>
                  <b>{Trans("INDUSTRY")}</b>
                </span>{" "}
                : {editDataInfo?.crm_lead_industry?.industry_name}
              </p>
              <p>
                <span>
                  <b>{Trans("FOLLOW_UP")}</b>
                </span>{" "}
                : {editDataInfo?.folllow_up == 1 ? "YES" : "NO"}
              </p>
            </Col>
            <Col col={6}>
              <p>
                <span>
                  <b>{Trans("WEBSITE")}</b>
                </span>{" "}
                : {editDataInfo?.website}
              </p>
              <p>
                <span>
                  <b>{Trans("SOURCE")}</b>
                </span>{" "}
                : {editDataInfo?.crm_lead_source?.source_name}
              </p>

              <p>
                <span>
                  <b>{Trans("FOLLOW_UP_STATUS")}</b>
                </span>{" "}
                : {editDataInfo?.crm_lead_followup?.followup_status}
              </p>
            </Col>
            <Col col={12}>
              <p>
                <span>
                  <b>{Trans("NEXT_FOLLOW_UP_DATE")}</b>
                </span>{" "}
                : {editDataInfo?.crm_lead_followup?.next_followup}
              </p>

              <p>
                <b>{Trans("CONTACT_INFO")} : </b>
                <br />
                {editDataInfo?.crm_lead_contact?.map((lead_contact, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <span>
                        {Trans("CONTACT_NAME")} : {lead_contact?.contact_name}
                      </span>
                      ,{" "}
                      <span>
                        {Trans("CONTACT_EMAIL")} : {lead_contact?.contact_email}
                      </span>
                      <br />
                    </React.Fragment>
                  );
                })}{" "}
              </p>

              <p>
                <b>{Trans("SOCIAL_LINKS")}</b>
                <br />
                {editDataInfo?.crm_lead_soclink?.map((socialLink, IDX) => {
                  return (
                    <React.Fragment key={IDX}>
                      <span key={IDX}>
                        {socialLink?.social_type}:{socialLink?.social_link}
                      </span>
                    </React.Fragment>
                  );
                })}{" "}
              </p>
            </Col>
            <Col col={12} className="text-right">
              <button
                className="btn btn-info"
                onClick={() => {
                  SetnewHistory(true);
                }}
              >
                {Trans("ADD_FOLLOW_UP")}
              </button>
              <br />
            </Col>
            {newHistory && (
              <Col col={12} className="mt-2 mb-2">
                <Card>
                  <Card.Header as="h5">
                    {Trans("ADD_FOLLOW_UP")}
                    <Button
                      variant="danger"
                      style={{ float: "right" }}
                      onClick={() => {
                        SetnewHistory(false);
                      }}
                    >
                      x
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <form
                      action="#"
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                    >
                      <input
                        type="hidden"
                        {...register("followup_id")}
                        value={editDataInfo?.crm_lead_followup?.followup_id}
                      />
                      <Row>
                        <Col col={6}>
                          <FormGroup mb="20px">
                            <Label
                              display="block"
                              mb="5px"
                              htmlFor={Trans("FOLLOW_UP_STATU", language)}
                            >
                              {Trans("FOLLOW_UP_STATUS", language)}
                            </Label>
                            <select
                              id={Trans("FOLLOW_UP_STATUS", language)}
                              placeholder={Trans("FOLLOW_UP_STATUS", language)}
                              className="form-control"
                              {...register("followup_status", {
                                required: Trans(
                                  "FOLLOW_UP_STATUS_REQUIRED",
                                  language
                                ),
                              })}
                            >
                              <option value="">
                                {Trans("SELECT_FOLLOW_UP_STATUS", language)}
                              </option>
                              {status &&
                                status.map((curr) => (
                                  <option
                                    value={curr.status_id}
                                    key={curr.status_id}
                                  >
                                    {curr.status_name}
                                  </option>
                                ))}
                            </select>

                            <span className="required">
                              <ErrorMessage
                                errors={errors}
                                name="followup_status"
                              />
                            </span>
                          </FormGroup>
                        </Col>
                        <Col col={6}>
                          <FormGroup mb="20px">
                            <Input
                              id="NEXT_FOLLOW_UP"
                              label={Trans("NEXT_FOLLOW_UP", language)}
                              placeholder={Trans("NEXT_FOLLOW_UP", language)}
                              className="form-control"
                              {...register("next_followup")}
                              type="date"
                            />
                            <span className="required">
                              <ErrorMessage
                                errors={errors}
                                name="next_followup"
                              />
                            </span>
                          </FormGroup>
                        </Col>
                        <Col col={12}>
                          <FormGroup mb="20px">
                            <Input
                              id="FOLLOW_UP_NOTE"
                              label={Trans("FOLLOW_UP_NOTE", language)}
                              placeholder={Trans("FOLLOW_UP_NOTE", language)}
                              className="form-control"
                              {...register("followup_note", {
                                required: Trans("FOLLOW_UP_NOTE", language),
                              })}
                            />
                            <span className="required">
                              <ErrorMessage
                                errors={errors}
                                name="followup_note"
                              />
                            </span>
                          </FormGroup>
                        </Col>
                        <Col col={12}>
                          <LoaderButton
                            formLoadStatus={formloadingStatus}
                            btnName={Trans("CREATE", language)}
                            className="btn btn-primary"
                          />
                        </Col>
                      </Row>
                    </form>
                  </Card.Body>
                </Card>
              </Col>
            )}
            <Col col={12} className="mt-2">
              <Card>
                <Card.Header>{Trans("FOLLOW_UP_HISTORY")}</Card.Header>
                <Card.Body>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{Trans("SL.NO")}</th>
                        <th>{Trans("NOTE")}</th>
                        <th>{Trans("DATE")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editDataInfo?.crm_lead_followup?.crm_lead_followup_history?.map(
                        (history, idx) => {
                          return (
                            <tr key={idx}>
                              <td>{idx}</td>
                              <td>{history?.followup_note}</td>
                              <td>{history?.created_at}</td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default View;
