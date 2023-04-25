import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  TemplateSectionUpdateUrl,
  TemplateSectionEditUrl,
  tempUploadFileUrl,
  TemplateListUrl,
} from "config/index";
import { useSelector, useDispatch } from "react-redux";
import { updateModuleListState } from "redux/slice/loginSlice";
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
import { useEffect } from "react";
import Loading from "component/Preloader";

const EditSection = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(TemplateSectionUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });
          // update side module and section
          props.RefreshList();
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

  const [templateListing, SetTemplateListing] = useState([]);

  const [sectionListing, SetSectionListing] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();
    const ModuleLoad = () => {
      const filterData = {
        api_token: apiToken,
      };
      POST(TemplateListUrl, filterData)
        .then((response) => {
          const { status, data, message } = response.data;
          if (status) {
            SetTemplateListing(data.template_list);
            SetSectionListing(data.section_list);
            setValueToField();
          } else Notify(false, Trans(message, language));
        })
        .catch((error) => {
          console.error("There was an error!", error);
          Notify(false, Trans(error.message, language));
        });
    };
    ModuleLoad();
    return () => abortController.abort();
  }, []);

  const setValueToField = () => {
    const editInfo = {
      api_token: apiToken,
      section_option_id: props.editId,
    };
    POST(TemplateSectionEditUrl, editInfo)
      .then((response) => {
        SetloadingStatus(false);
        const { data } = response.data;
        const fieldList = getValues();
        for (const key in fieldList) {
          setValue(key, data[key]);
        }
      })
      .catch((error) => {
        SetloadingStatus(false);
      });
  };

  const HandleDocumentUpload = (event, previewUrlId, StoreID) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;

    var readers = new FileReader();
    readers.onload = function (e) {
      console.log("filereade", e);
      document.getElementById(
        previewUrlId
      ).innerHTML = `<img src=${e.target.result} height="100" />`;
    };
    readers.readAsDataURL(event.target.files[0]);

    // upload temp image and bind value to array
    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", event.target.files[0]);
    formdata.append("images_type", 1);
    POST(tempUploadFileUrl, formdata)
      .then((response) => {
        console.log("temp", response);
        setValue(StoreID, response.data.data);
      })
      .catch((error) => {
        Notify(false, error.message);
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
          <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
            <input type="hidden" {...register("section_option_id")} />

            <Row>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("TEMPLATE", language)}
                  >
                    {Trans("TEMPLATE", language)}
                  </Label>
                  <select
                    id={Trans("TEMPLATE", language)}
                    placeholder={Trans("TEMPLATE", language)}
                    className="form-control"
                    {...register("template_id", {
                      required: Trans("TEMPLATE_GROUP_REQUIRED", language),
                    })}
                  >
                    <option value="">
                      {Trans("SELECT_TEMPLATE", language)}
                    </option>
                    {templateListing &&
                      templateListing.map((curr) => (
                        <option
                          value={`${curr.template_id}`}
                          key={curr.template_id}
                        >
                          {curr.template_name}
                        </option>
                      ))}
                  </select>

                  <span className="required">
                    <ErrorMessage errors={errors} name="template_id" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("TEMPLATE_SECTION", language)}
                  >
                    {Trans("TEMPLATE_SECTION", language)}
                  </Label>
                  <select
                    id={Trans("TEMPLATE_SECTION", language)}
                    placeholder={Trans("TEMPLATE_SECTION", language)}
                    className="form-control"
                    {...register("section_id", {
                      required: Trans("TEMPLATE_SECTION_REQUIRED", language),
                    })}
                  >
                    <option value="">
                      {Trans("SELECT_TEMPLATE_SECTION", language)}
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
              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("SECTION_OPTION_NAME", language)}
                    label={Trans("SECTION_OPTION_NAME", language)}
                    placeholder={Trans("SECTION_OPTION_NAME", language)}
                    className="form-control"
                    {...register("section_option_name", {
                      required: Trans("SECTION_OPTION_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="section_option_name" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("SECTION_OPTION_KEY", language)}
                    label={Trans("SECTION_OPTION_KEY", language)}
                    placeholder={Trans("SECTION_OPTION_KEY", language)}
                    className="form-control"
                    {...register("section_option_key", {
                      required: Trans("SECTION_OPTION_KEY_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="section_option_key" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup>
                  <Label display="block" mb="5px" htmlFor={"fileupload"}>
                    {Trans("IMAGE", language)}
                  </Label>
                  <div className="custom-file">
                    <input type="hidden" {...register("images_id")} />
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                      onChange={(event) =>
                        HandleDocumentUpload(event, "fileupload", "images_id")
                      }
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      {Trans("CHOOSE_IMAGE", language)}
                    </label>
                    <div id={"fileupload"}></div>
                  </div>
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
      )}
    </>
  );
};

export default EditSection;
