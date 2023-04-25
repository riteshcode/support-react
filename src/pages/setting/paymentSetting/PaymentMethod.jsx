import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { Row, Col, LoaderButton } from "component/UIElement/UIElement";
import { tempUploadFileUrl } from "config/index";
import { useSelector } from "react-redux";
import Notify from "component/Notify";
import PaymentMethodKey from "./PaymentMethodKey";
import { Alert, Tab, Tabs } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { paymentUpdateUrl } from "config";
import { Trans } from "lang/index";

function PaymentMethod({ fieldKey }) {
  const { apiToken, language, userType } = useSelector((state) => state.login);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const [listData, SetlistData] = useState([]);
  const [HelperData, SetHelperData] = useState([]);

  const methods = useForm();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = methods;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;

    POST(paymentUpdateUrl, formData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
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
          Notify(true, Trans(errObj.msg, language));
          // setError(errObj);
        }
      })
      .catch((error) => {
        console.log(error);
        SetformloadingStatus(false);
        Notify(true, Trans(error.message, language));
      });
  };

  // for tab sysytem
  const [key, setKey] = useState(0);

  // select condition
  const conditionData = ["default_language", "default_currency", "country"];
  const verifyKey = (key) => {
    return conditionData.includes(key);
  };

  return (
    <React.Fragment>
      <Tabs
        defaultActiveKey={`set_0`}
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        {fieldKey.map((item, idx) => {
          return (
            <Tab eventKey={`set_${idx}`} key={idx} title={item.method_name}>
              <FormProvider {...methods}>
                <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Row>
                    <Col col={12}>
                      <PaymentMethodKey
                        fieldKey={item.payment_methods_details}
                        currKey={item.payment_method_id}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col col={3}>
                      <LoaderButton
                        formLoadStatus={formloadingStatus}
                        btnName={Trans("UPDATE", language)}
                        className="btn btn-primary btn-block"
                      />
                    </Col>
                  </Row>
                </form>
              </FormProvider>
            </Tab>
          );
        })}
      </Tabs>
    </React.Fragment>
  );
}

export default PaymentMethod;
