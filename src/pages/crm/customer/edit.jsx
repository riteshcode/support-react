import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm, FormProvider } from "react-hook-form";
import {
  customerUpdateUrl,
  customerEditUrl,
  leadCreateUrl,
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
import Loading from "component/Preloader";
import { ErrorMessage } from "@hookform/error-message";
import EditMultipleContact from "./component/EditMultipleContact";
import EditMultipleAddress from "./component/EditMultipleAddress";

const Edit = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const [contactInfo, SetContactInfo] = useState([
    // { contact_id: "", contact_name: "", contact_email: "" },
  ]);

  const [multiAdd, SetmultiAdd] = useState([
    // {
    //   address_id: "",
    //   address_type: "",
    //   street_address: "",
    //   city: "",
    //   state: "",
    //   zipcode: "",
    //   countries_id: "",
    //   phone: "",
    // },
  ]);

  const methodsCustomer = useForm({
    defaultValues: {
      contactInfo: contactInfo,
      mulAddress: multiAdd,
    },
  });

  // console.log("methodsCustomer", methodsCustomer);

  // console.log("contactInfo", contactInfo);
  // console.log("multiAdd", multiAdd);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = methodsCustomer;

  const [contentloadingStatus, SetloadingStatus] = useState(false);

  const { editData, source, industry, status, agent, country } = props;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(customerUpdateUrl, saveFormData)
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

  const [selectedSource, SetSelectedSource] = useState("");

  const [selectedData, SetSelectedData] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();

    async function setValueToField() {
      const editInfo = {
        api_token: apiToken,
        customer_id: editData,
      };

      POST(customerEditUrl, editInfo)
        .then((response) => {
          SetloadingStatus(false);
          const { data } = response.data;
          const fieldList = getValues();
          for (const key in fieldList) {
            setValue(key, data[key]);
          }
          SetContactInfo(data?.crm_customer_contact);
          SetmultiAdd(data?.crm_customer_address);
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
          <FormProvider {...methodsCustomer}>
            <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
              <input type="hidden" {...register("customer_id")} />
              <Row>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("LEAD_ID", language)}
                    >
                      {Trans("LEAD_ID", language)}
                    </Label>
                    <select
                      id={Trans("LEAD_ID", language)}
                      placeholder={Trans("LEAD_ID", language)}
                      className="form-control"
                      {...register("lead_id", {
                        required: Trans("LEAD_ID_REQUIRED", language),
                      })}
                    >
                      <option value="">
                        {Trans("SELECT_SOURCE", language)}
                      </option>
                      {source &&
                        source.map((curr) => (
                          <option value={curr.lead_id} key={curr.lead_id}>
                            {curr.company_name}
                          </option>
                        ))}
                    </select>

                    <span className="required">
                      <ErrorMessage errors={errors} name="lead_id" />
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
                  <EditMultipleContact contactEditData={contactInfo} />
                </Col>
                <Col col={12}>
                  <EditMultipleAddress
                    country={country}
                    contactEditData={multiAdd}
                  />
                </Col>

                <Col col={12}>
                  <LoaderButton
                    formLoadStatus={formloadingStatus}
                    btnName={Trans("UPDATE", language)}
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
