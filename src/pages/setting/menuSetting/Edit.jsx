import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { MenuUpdateUrl, MenuCreateUrl, MenuEditUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Label,
  Input,
} from "component/UIElement/UIElement";
import { ErrorMessage } from "@hookform/error-message";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";

const Edit = (props) => {
  const { editData } = props;

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
    setValue,
    getValues,
    handleSubmit,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;
    POST(MenuUpdateUrl, formData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });
          props.filterItem();
          //   props.handleModalClose();
          //   props.loadSettingData();
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
              console.log(message[key][0]);
              errMsg += Trans(message[key][0], language);
              return errMsg;
            });
            errObj.msg = errMsg;
          } else {
            errObj.msg = Trans(message, language);
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

  const [sectionListing, SetSectionListing] = useState([]);
  const [MenuType, SetMenuType] = useState("");
  const ModuleLoad = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(MenuCreateUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetSectionListing(data);
          setValueToField();
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });
  };

  const [contentloadingStatus, SetloadingStatus] = useState(true);

  function setValueToField() {
    const editInfo = {
      api_token: apiToken,
      menu_id: editData,
    };

    POST(MenuEditUrl, editInfo)
      .then((response) => {
        SetloadingStatus(false);
        const { data } = response.data;
        const fieldList = getValues();
        for (const key in fieldList) {
          console.log(key, data[key]);
          setValue(key, data[key]);
        }
      })
      .catch((error) => {
        SetloadingStatus(false);
        Notify(false, error.message);
      });
  }

  useEffect(() => {
    let abortController = new AbortController();
    ModuleLoad();
    return () => abortController.abort();
  }, []);

  return (
    <React.Fragment>
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
        <input type="hidden" {...register("menu_id")} />
        <input
          type="hidden"
          {...register("group_id")}
          defaultValue={props.menuGroupId}
        />
        <Row>
          <Col col={12}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("MENU_TYPE", language)}
              >
                {Trans("MENU_TYPE", language)}
              </Label>
              <select
                id={Trans("MENU_TYPE", language)}
                placeholder={Trans("MENU_TYPE", language)}
                className="form-control"
                {...register("menu_type", {
                  required: Trans("SELECT_MENU_TYPE_REQUIRED", language),
                })}
                onChange={(e) => {
                  e.preventDefault();
                  SetMenuType(e.target.value);
                  setValue("menu_link", "");
                }}
              >
                <option value="">{Trans("SELECT_MENU_TYPE", language)}</option>
                <option value="1">{Trans("CATEGORY", language)}</option>
                <option value="2">{Trans("PAGE", language)}</option>
                <option value="3">{Trans("CUSTOM_LINK", language)}</option>
              </select>
              <span className="required">
                <ErrorMessage errors={errors} name="menu_type" />
              </span>
            </FormGroup>
          </Col>

          {MenuType === "2" && (
            <Col col={12}>
              <FormGroup mb="20px">
                <Label
                  display="block"
                  mb="5px"
                  htmlFor={Trans("PAGE", language)}
                >
                  {Trans("PAGE", language)}
                </Label>
                <select
                  id={Trans("PAGE", language)}
                  placeholder={Trans("PAGE", language)}
                  className="form-control"
                  {...register("PAGE", {
                    required: Trans("SELECT_PAGE_REQUIRED", language),
                  })}
                  onChange={(e) => {
                    e.preventDefault();
                    setValue("menu_link", e.target.value);
                  }}
                >
                  <option value="">{Trans("SELECT_PAGE", language)}</option>
                  {sectionListing?.page_data &&
                    sectionListing?.page_data.map((curr, idx) => (
                      <option value={curr.pages_slug} key={idx}>
                        {curr.pages_slug}
                      </option>
                    ))}
                </select>
                <span className="required">
                  <ErrorMessage errors={errors} name="PAGE" />
                </span>
              </FormGroup>
            </Col>
          )}

          {MenuType === "1" && (
            <Col col={12}>
              <FormGroup mb="20px">
                <Label
                  display="block"
                  mb="5px"
                  htmlFor={Trans("CATEGORY", language)}
                >
                  {Trans("CATEGORY", language)}
                </Label>
                <select
                  id={Trans("CATEGORY", language)}
                  placeholder={Trans("CATEGORY", language)}
                  className="form-control"
                  {...register("CATEGORY", {
                    required: Trans("SELECT_CATEGORY_REQUIRED", language),
                  })}
                  onChange={(e) => {
                    e.preventDefault();
                    setValue("menu_link", e.target.value);
                  }}
                >
                  <option value="">{Trans("SELECT_CATEGORY", language)}</option>
                  {sectionListing?.category_data &&
                    sectionListing?.category_data.map((curr, idx) => (
                      <option value={curr.categories_slug} key={idx}>
                        {curr.categories_slug}
                      </option>
                    ))}
                </select>
                <span className="required">
                  <ErrorMessage errors={errors} name="CATEGORY" />
                </span>
              </FormGroup>
            </Col>
          )}

          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("MENU_NAME", language)}
                label={Trans("MENU_NAME", language)}
                placeholder={Trans("MENU_NAME", language)}
                className="form-control"
                {...register("menu_name", {
                  required: Trans("MENU_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="menu_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("MENU_LINK", language)}
                label={Trans("MENU_LINK", language)}
                placeholder={Trans("MENU_LINK", language)}
                className="form-control"
                {...register("menu_link", {
                  required: Trans("MENU_LINK_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="menu_link" />
              </span>
            </FormGroup>
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
    </React.Fragment>
  );
};

export default Edit;
