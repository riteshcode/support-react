import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm, FormProvider } from "react-hook-form";
import { leadImportFileUrl, leadCreateUrl } from "config/index";
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

const ImportModal = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const methods = useForm({
    defaultValues: {
      contact: [{ contact_name: "", contact_email: "" }],
      socialLink: [{ social_type: "", social_link: "" }],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (UseData) => {
    SetformloadingStatus(true);
    // const saveFormData = formData;
    // saveFormData.api_token = apiToken;
    if (chooseFile === "") {
      Notify(false, "CHOOSE_CSV_FILE");
      SetformloadingStatus(false);
      return "";
    }

    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", chooseFile);
    formdata.append("source_id", UseData.source_id);

    POST(leadImportFileUrl, formdata)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          props.handleModalClose();
          Notify(true, Trans(message, language));
          props.filterItem("refresh", "", "");
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

  const [chooseFile, SetChooseFile] = useState("");

  const [source, SetSource] = useState([]);
  const [industry, SetIndustry] = useState([]);
  const [status, SetStatus] = useState([]);
  const [agent, SetAgent] = useState([]);
  const [country, SetCountry] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();
    const formData = {
      api_token: apiToken,
    };

    POST(leadCreateUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetSource(data?.leadsource);
          SetIndustry(data?.industrydata);
          SetStatus(data?.leadstatus);
          SetAgent(data?.crmagentdata);
          SetCountry(data?.countrydata);
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
        console.error("There was an error!", error);
      });
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
      <FormProvider {...methods}>
        <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Row>
            <Col col={12}>
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
                >
                  <option value="">{Trans("SELECT_SOURCE", language)}</option>
                  {source &&
                    source.map((curr) => (
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
            <Col col={12}>
              <FormGroup mb="20px">
                <Input
                  id="CHOOSE_FILE"
                  label={Trans("CHOOSE_FILE", language)}
                  placeholder={Trans("CHOOSE_FILE", language)}
                  className="form-control"
                  type="file"
                  name="fileInfo"
                  onChange={(event) => {
                    const info = event.target.files[0];
                    if (info.type === "application/vnd.ms-excel")
                      SetChooseFile(event.target.files[0]);
                    else Notify(false, "CHOOSE_CSV_FILE");
                  }}
                />
                <span className="required">
                  <ErrorMessage errors={errors} name="excel_file" />
                </span>
              </FormGroup>
            </Col>
            <Col col={12}>
              <LoaderButton
                formLoadStatus={formloadingStatus}
                btnName={Trans("Import", language)}
                className="btn btn-primary btn-block"
              />
            </Col>
          </Row>
        </form>
      </FormProvider>
    </>
  );
};

export default ImportModal;
