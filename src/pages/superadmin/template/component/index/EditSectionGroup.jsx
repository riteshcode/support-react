import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  TemplateSectionGroupUpdateUrl,
  TemplateSectionGroupEditUrl,
  TemplateUrl,
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

const EditSectionGroup = (props) => {
  const [ShowType, SetType] = useState("parent");

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

    POST(TemplateSectionGroupUpdateUrl, saveFormData)
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

  const [GroupListing, SetGroupListing] = useState([]);

  const ModuleChange = (e) => {
    let value = e.target.value;
    const sectionLis = value.split("::");
    SetGroupListing(JSON.parse(sectionLis[1]));
  };

  useEffect(() => {
    let abortController = new AbortController();
    const ModuleLoad = () => {
      const filterData = {
        api_token: apiToken,
      };
      POST(TemplateUrl, filterData)
        .then((response) => {
          const { status, data, message } = response.data;

          if (status) {
            SetTemplateListing(data);
          } else Notify(false, Trans(message, language));
        })
        .catch((error) => {
          console.error("There was an error!", error);
          Notify(false, Trans(error.message, language));
        });
    };
    ModuleLoad();
    return () => abortController.abort();
  }, [apiToken]);

  const [selectedModule, SetSelectedModule] = useState("");
  const [selectedSection, SetSelectedSection] = useState("");
  useEffect(() => {
    let abortController = new AbortController();

    function setValueToField() {
      const editInfo = {
        api_token: apiToken,
        group_id: props.editId,
      };
      POST(TemplateSectionGroupEditUrl, editInfo)
        .then((response) => {
          SetloadingStatus(false);
          const { data } = response.data;
          const fieldList = getValues();
          for (const key in fieldList) {
            setValue(key, data[key]);
          }
          SetGroupListing(data.template_section_groups);
        })
        .catch((error) => {
          console.log(error);
          SetloadingStatus(false);
          alert(error.message);
        });
    }
    setValueToField();
    return () => abortController.abort();
  }, [props.editId, selectedModule, templateListing]);

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
            <input type="hidden" {...register("group_id")} />

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
                      required: Trans("TEMPLATE_ID_REQUIRED", language),
                    })}
                    defaultValue={selectedModule}
                  >
                    <option value="">
                      {Trans("SELECT_TEMPLATE", language)}
                    </option>
                    {templateListing &&
                      templateListing.map((curr) => (
                        <option value={curr.template_id} key={curr.template_id}>
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
                  <Input
                    id={Trans("GROUP_NAME", language)}
                    label={Trans("GROUP_NAME", language)}
                    placeholder={Trans("GROUP_NAME", language)}
                    className="form-control"
                    {...register("group_name", {
                      required: Trans("GROUP_NAME_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="group_name" />
                  </span>
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Input
                    id={Trans("GROUP_KEY", language)}
                    label={Trans("GROUP_KEY", language)}
                    placeholder={Trans("GROUP_KEY", language)}
                    className="form-control"
                    {...register("group_key", {
                      required: Trans("GROUP_KEY_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="group_key" />
                  </span>
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

export default EditSectionGroup;
