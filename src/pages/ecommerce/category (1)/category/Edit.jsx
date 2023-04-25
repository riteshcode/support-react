import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  categoryEditUrl,
  categoryUpdateUrl,
  tempUploadFileUrl,
  createSubCategoryUrl,
} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  TextArea,
  StatusSelect,
  Label,
} from "component/UIElement/UIElement";
import { Alert, Tab, Tabs } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import Loading from "component/Preloader";

const Edit = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [key, setKey] = useState("en");
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const { editData } = props;

  const onSubmit = (formData) => {
    console.log("formData", formData);
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(categoryUpdateUrl, saveFormData)
      .then((response) => {
        console.log("response", response);
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
        SetformloadingStatus(false);
        Notify(false, error.message);
      });
  };

  const [langList, SetlangList] = useState([]);
  const [editStatus, SetEditStatus] = useState(1);
  const [categoryList, SetCategoryList] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();
    const formData = {
      api_token: apiToken,
      language: language,
    };
    POST(createSubCategoryUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetCategoryList(data.category);
          SetlangList(data.language);
          setValueToField();
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
        console.error("There was an error!", error);
      });
    return () => abortController.abort();
  }, []);

  const setValueToField = () => {
    POST(categoryEditUrl, {
      api_token: apiToken,
      categories_id: editData,
    })
      .then((response) => {
        SetloadingStatus(false);
        const { data } = response.data;

        const fieldList = getValues();
        for (const key in fieldList) {
          setValue(key, data[key]);
        }
        // convert all array to object
        const { categorydescription } = data;
        if (categorydescription.length > 0) {
          for (let index = 0; index < categorydescription.length; index++) {
            for (const key in categorydescription[index]) {
              const keyName =
                key + "_" + categorydescription[index]["languages_id"];
              const KeyValue = categorydescription[index][key];

              setValue(keyName, KeyValue);
            }
            // set meta info
            if (categorydescription[index].seo !== null) {
              setValue(
                "categories_title_" +
                  categorydescription[index]["languages_id"],
                categorydescription[index].seo.seometa_title
              );
              setValue(
                "categories_meta_desc_" +
                  categorydescription[index]["languages_id"],
                categorydescription[index].seo.seometa_desc
              );
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
        SetloadingStatus(false);
        alert(error.message);
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
      ).innerHTML = `<a href=${e.target.result} download >Preview</a>`;
    };
    readers.readAsDataURL(event.target.files[0]);

    // upload temp image and bind value to array
    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", event.target.files[0]);
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
    <React.Fragment>
      {contentloadingStatus ? (
        <Loading />
      ) : (
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
            <input type="hidden" {...register("categories_id")} />
            <Row>
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
                    {...register("parent_id")}
                  >
                    <option value={0}>
                      {Trans("SELECT_CATEGORY", language)}
                    </option>
                    {categoryList &&
                      categoryList.map((curr) => (
                        <React.Fragment key={curr.categories_id}>
                          <option value={curr.categories_id}>
                            {curr.category_name}
                          </option>
                          {curr.sub_category.length > 0 &&
                            curr.sub_category.map((subcat) => {
                              return (
                                <React.Fragment key={subcat.categories_id}>
                                  <option value={subcat.categories_id}>
                                    -- {subcat.category_name}
                                  </option>
                                </React.Fragment>
                              );
                            })}
                        </React.Fragment>
                      ))}
                  </select>
                  <span className="required">
                    <ErrorMessage errors={errors} name="main_category" />
                  </span>
                </FormGroup>
              </Col>

              <Col col={12}>
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  {langList &&
                    langList.map((lang) => {
                      const { languages_code, languages_id, languages_name } =
                        lang;
                      return (
                        <Tab
                          eventKey={languages_code}
                          key={languages_id}
                          title={languages_name}
                        >
                          <Row>
                            <Col col={6}>
                              <FormGroup mb="20px">
                                <input
                                  type="hidden"
                                  {...register(
                                    `categories_description_id_${languages_id}`
                                  )}
                                />
                                <Input
                                  id={`${Trans(
                                    "CATEGORY_NAME",
                                    language
                                  )} (${languages_code})`}
                                  label={`${Trans(
                                    "CATEGORY_NAME",
                                    language
                                  )} (${languages_code})`}
                                  placeholder={`${Trans(
                                    "CATEGORY_NAME",
                                    language
                                  )} (${languages_code})`}
                                  hint="Enter text" // for bottom hint
                                  className="form-control"
                                  {...register(
                                    `categories_name_${languages_id}`,
                                    {
                                      required: Trans(
                                        "CATEGORY_NAME_REQUIRED",
                                        language
                                      ),
                                    }
                                  )}
                                />
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name={`categories_name_${languages_id}`}
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                            <Col col={6}>
                              <FormGroup mb="20px">
                                <Input
                                  id={`${Trans(
                                    "CATEGORIES_TITLE",
                                    language
                                  )} (${languages_code})`}
                                  label={`${Trans(
                                    "CATEGORIES_TITLE",
                                    language
                                  )} (${languages_code})`}
                                  placeholder={`${Trans(
                                    "CATEGORIES_TITLE",
                                    language
                                  )} (${languages_code})`}
                                  className="form-control"
                                  {...register(
                                    `categories_title_${languages_id}`
                                  )}
                                />
                              </FormGroup>
                            </Col>

                            <Col col={6}>
                              <FormGroup mb="20px">
                                <TextArea
                                  id={`${Trans(
                                    "CATEGORY_DESCRIPTION",
                                    language
                                  )} (${languages_code})`}
                                  label={`${Trans(
                                    "CATEGORY_DESCRIPTION",
                                    language
                                  )} (${languages_code})`}
                                  placeholder={`${Trans(
                                    "CATEGORY_DESCRIPTION",
                                    language
                                  )} (${languages_code})`}
                                  hint="Enter text" // for bottom hint
                                  className="form-control"
                                  {...register(
                                    `categories_description_${languages_id}`
                                  )}
                                />
                              </FormGroup>
                            </Col>

                            <Col col={6}>
                              <FormGroup mb="20px">
                                <TextArea
                                  id={`${Trans(
                                    "CATEGORY_META_DESCRIPTION",
                                    language
                                  )} (${languages_code})`}
                                  label={`${Trans(
                                    "CATEGORY_META_DESCRIPTION",
                                    language
                                  )} (${languages_code})`}
                                  placeholder={`${Trans(
                                    "CATEGORY_META_DESCRIPTION",
                                    language
                                  )} (${languages_code})`}
                                  hint="Enter text" // for bottom hint
                                  className="form-control"
                                  {...register(
                                    `categories_meta_desc_${languages_id}`
                                  )}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Tab>
                      );
                    })}
                </Tabs>
              </Col>

              <Col col={6}>
                <FormGroup>
                  <Label display="block" mb="5px" htmlFor={"fileupload"}>
                    {Trans("CATEGORY_IMAGE", language)}
                  </Label>
                  <div className="custom-file">
                    <input type="hidden" {...register("categories_image")} />
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                      onChange={(event) =>
                        HandleDocumentUpload(
                          event,
                          "fileupload",
                          "categories_image"
                        )
                      }
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      {Trans("CHOOSE_FILE", language)}
                    </label>
                    <div id={"fileupload"}></div>
                  </div>
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
                    {...register("sort_order", {
                      required: Trans("SORT_ORDER_REQUIRED", language),
                    })}
                  />
                  <span className="required">
                    <ErrorMessage errors={errors} name="sort_order" />
                  </span>
                </FormGroup>
              </Col>

              <Col col={12} style={{ marginTop: "10px" }}>
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("UPDATE", language)}
                  className="btn btn-primary btn-block"
                />
              </Col>
              <br />
            </Row>
          </form>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Edit;
