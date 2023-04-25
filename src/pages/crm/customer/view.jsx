import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm, FormProvider } from "react-hook-form";
import {
  leadFollowUpStoreUrl,
  customerViewUrl,
  customerIsDefaultUrl,
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
import { Alert, Card, Button } from "react-bootstrap";
import Notify from "component/Notify";
import Loading from "component/Preloader";

const View = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(true);

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
      customer_id: editData,
    };

    POST(customerViewUrl, editInfo)
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

  const handleIsDefault = (id, type) => {
    SetloadingStatus(true);

    const editInfo = {
      api_token: apiToken,
      update_id: id,
      type: type,
    };

    POST(customerIsDefaultUrl, editInfo)
      .then((response) => {
        SetloadingStatus(false);
        const { message } = response.data;
        Notify(true, Trans(message, language));
        setValueToField();
      })
      .catch((error) => {
        SetloadingStatus(false);
        Notify(false, Trans(error.message, language));
      });
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
          <Row>
            <Col col={12}>
              <p>
                <span>
                  <b>{Trans("COMPANY_NAME")}</b>
                </span>{" "}
                : {editDataInfo?.company_name}
              </p>
            </Col>
            <Col col={12}>
              <p>
                <span>
                  <b>{Trans("WEBSITE")}</b>
                </span>{" "}
                : {editDataInfo?.website}
              </p>
              <p>
                <span>
                  <b>{Trans("STATUS")}</b>
                </span>{" "}
                :{" "}
                {editDataInfo?.status === 1 ? (
                  <span className="badge badge-success">Active</span>
                ) : (
                  <span className="badge badge-danger">Deactive</span>
                )}
              </p>
            </Col>

            <Col col={12} className="mt-2">
              <Card>
                <Card.Header>{Trans("CONTACT_HISTORY")}</Card.Header>
                <Card.Body>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{Trans("SL.NO")}</th>
                        <th>{Trans("CONTACT_NAME")}</th>
                        <th>{Trans("CONTACT_EMAIL")}</th>
                        <th>{Trans("IS_DEFAULT")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editDataInfo?.crm_customer_contact?.map(
                        (history, idx) => {
                          return (
                            <tr key={idx}>
                              <td>{idx}</td>
                              <td>{history?.contact_name}</td>
                              <td>{history?.contact_email}</td>
                              <td>
                                {history?.is_default === 1 ? (
                                  <span className="badge badge-success">
                                    YES
                                  </span>
                                ) : (
                                  <a
                                    href=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleIsDefault(
                                        history?.contact_id,
                                        "contact"
                                      );
                                    }}
                                    className=""
                                  >
                                    Make Default
                                  </a>
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>

            <Col col={12} className="mt-2">
              <Card>
                <Card.Header>{Trans("ADDRESS_HISTORY")}</Card.Header>
                <Card.Body>
                  <Row>
                    {editDataInfo?.crm_customer_address?.map((history, idx) => {
                      return (
                        <Col col={6}>
                          <Card>
                            <Card.Body>
                              <p>
                                <b>{Trans("ADDRESS_TYPE")}</b> :{" "}
                                {history?.address_type === 1 && "COMMON"}
                                {history?.address_type === 2 && "BILLING"}
                                {history?.address_type === 3 && "SHIPPING"}
                              </p>
                              <p>
                                <b>{Trans("STREET_ADDRESS")}</b> :{" "}
                                {history?.street_address}
                              </p>
                              <p>
                                <b>{Trans("CITY")}</b> : {history?.city}
                              </p>
                              <p>
                                <b>{Trans("STATE")}</b> : {history?.state}
                              </p>
                              <p>
                                <b>{Trans("COUNTRY")}</b> :{" "}
                                {history?.countries_id}
                              </p>
                              <p>
                                <b>{Trans("IS_DEFAULT")}</b> :{" "}
                                {history?.is_default === 1 ? (
                                  <span className="badge badge-success">
                                    YES
                                  </span>
                                ) : (
                                  <a
                                    href=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleIsDefault(
                                        history?.address_id,
                                        "address"
                                      );
                                    }}
                                    className=""
                                  >
                                    Make Default
                                  </a>
                                )}
                              </p>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
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
