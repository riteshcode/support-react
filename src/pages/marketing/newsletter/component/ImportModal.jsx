import React, { useState } from "react";
import POST from "axios/post";
import { useForm, FormProvider } from "react-hook-form";
import { NewsletterImportFileUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
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

    POST(NewsletterImportFileUrl, formdata)
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
                <Input
                  id="CHOOSE_FILE"
                  label={Trans("CHOOSE_FILE", language)}
                  placeholder={Trans("CHOOSE_FILE", language)}
                  className="form-control"
                  type="file"
                  name="fileInfo"
                  onChange={(event) => {
                    const info = event.target.files[0];
                    if (info.type === "application/vnd.ms-excel" || info.type==="text/csv" )
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
