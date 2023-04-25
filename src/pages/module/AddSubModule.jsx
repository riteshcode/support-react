import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { moduleSectionStoreUrl, moduleUrlAll } from "config/index";
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

const AddSubModule = (props) => {
  const dispatch = useDispatch();
  const [ShowType, SetType] = useState("parent");

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
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(moduleSectionStoreUrl, saveFormData)
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
          dispatch(updateModuleListState(data));
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

  const ModuleChange = (e) => {
    let value = e.target.value;
    const sectionLis = value.split("::");
    setValue("module_id", sectionLis[0]);
    SetSectionListing(JSON.parse(sectionLis[1]));
  };

  useEffect(() => {
    let abortController = new AbortController();
    ModuleLoad();
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
      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="hidden" value="" {...register("module_id")} />

        <Row>
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
                      value={`${curr.module_id}::${JSON.stringify(curr.menu)}`}
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
              <Label display="block" mb="5px" htmlFor={Trans("TYPE", language)}>
                {Trans("SECTION_TYPE", language)}
              </Label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="radio"
                id="SECTION_TYPE"
                {...register("SECTION_TYPE")}
                onClick={() => {
                  SetType("parent");
                }}
                defaultChecked={true}
                defaultValue="parent"
              />
              &nbsp;
              {Trans("Parent", language)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="radio"
                id="SECTION_TYPE"
                {...register("SECTION_TYPE")}
                onClick={() => {
                  SetType("child");
                }}
                defaultValue="child"
              />
              &nbsp;
              {Trans("Child", language)}
            </FormGroup>
          </Col>
          {ShowType === "parent" ? (
            <input type="hidden" {...register("parent_section_id")} value={0} />
          ) : (
            <Col col={12}>
              <FormGroup mb="20px">
                <Label
                  display="block"
                  mb="5px"
                  htmlFor={Trans("PARENT_SECTION", language)}
                >
                  {Trans("PARENT_SECTION", language)}
                </Label>
                <select
                  id={Trans("PARENT_SECTION", language)}
                  placeholder={Trans("PARENT_SECTION", language)}
                  className="form-control"
                  {...register("parent_section_id", {
                    required: Trans("PARENT_SECTION_REQUIRED", language),
                  })}
                >
                  <option value="">{Trans("SELECT_SECTION", language)}</option>
                  {sectionListing &&
                    sectionListing.map((curr) => (
                      <option value={curr.section_id} key={curr.section_id}>
                        {curr.section_name}
                      </option>
                    ))}
                </select>

                <span className="required">
                  <ErrorMessage errors={errors} name="parent_section_id" />
                </span>
              </FormGroup>
            </Col>
          )}

          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SECTION_NAME", language)}
                label={Trans("SECTION_NAME", language)}
                placeholder={Trans("SECTION_NAME", language)}
                className="form-control"
                {...register("section_name", {
                  required: Trans("SECTION_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="section_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SECTION_ICON", language)}
                label={Trans("SECTION_ICON", language)}
                placeholder={Trans("SECTION_ICON", language)}
                className="form-control"
                {...register("section_icon")}
              />
              <span className="required">
                <a
                  href="https://feathericons.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Search SECTION Icons
                </a>
                <ErrorMessage errors={errors} name="section_icon" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SORT_ORDER", language)}
                type="number"
                label={Trans("SORT_ORDER", language)}
                placeholder={Trans("SORT_ORDER", language)}
                className="form-control"
                {...register("sort_order")}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="sort_order" />
              </span>
            </FormGroup>
          </Col>

          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("SECTION_URL", language)}
                label={Trans("SECTION_URL", language)}
                placeholder={Trans("SECTION_URL", language)}
                className="form-control"
                {...register("section_url", {
                  required: Trans("SECTION_URL_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="section_url" />
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
  );
};

export default AddSubModule;
