import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { PageCategories, PreAdd, PreView } from "config/PermissionName";
import { Anchor } from "component/UIElement/UIElement";
import WebsiteLink from "config/WebsiteLink";
import { useForm } from "react-hook-form";
import { PageSetting } from "config/WebsiteUrl";

import {
  PagesUpdateUrl,
  PagesEditUrl,
  createSubCategoryUrl,
} from "config/index";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  TextArea,
  Label,
} from "component/UIElement/UIElement";
import { Alert, Tab, Tabs } from "react-bootstrap";
import { ErrorMessage } from "@hookform/error-message";
import { useParams } from "react-router-dom";
import MyEditor from "component/MyEditor";

const Edit = () => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const { pageId } = useParams();

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

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(PagesUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
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
        Notify(false, error.message);
      });
  };

  const [langList, SetlangList] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();
    const formData = {
      api_token: apiToken,
      language: language,
    };
    POST(createSubCategoryUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        console.log(data);
        if (status) {
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

  // input field value set
  const [tempEditorValue, SettempEditorValue] = useState("");

  const setValueToField = () => {
    POST(PagesEditUrl, {
      api_token: apiToken,
      pages_id: pageId,
    })
      .then((response) => {
        SetloadingStatus(false);

        const { data } = response.data;

        const fieldList = getValues();
        for (const key in fieldList) {
          setValue(key, data[key]);
        }

        // convert all array to object
        const { pagedescription } = data;
        if (pagedescription.length > 0) {
          for (let index = 0; index < pagedescription.length; index++) {
            for (const key in pagedescription[index]) {
              const keyName = key + "_" + pagedescription[index]["language_id"];
              const KeyValue = pagedescription[index][key];

              setValue(keyName, KeyValue);
            }
            // set meta info
            setValue(
              "pages_title_" + pagedescription[index]["language_id"],
              pagedescription[index].pages_title
            );
            SettempEditorValue(pagedescription);
            setValue(
              "pages_content_" + pagedescription[index]["language_id"],
              pagedescription[index].pages_content
            );
          }
        }
      })
      .catch((error) => {
        SetloadingStatus(false);
        Notify(false, error.message);
      });
  };

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          { title: Trans("PAGES", language), link: "", class: "" },
          { title: Trans("EDIT", language), link: "", class: "active" },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageCategories} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("EDIT_PAGES", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageCategories}
                    PageAction={PreAdd}
                  >
                    <Anchor path={WebsiteLink(PageSetting)} variant="primary">
                      <FeatherIcon
                        icon="minus"
                        fill="white"
                        className="wd-10 mg-r-5"
                      />
                      {Trans("GO_BACK", language)}
                    </Anchor>
                  </CheckPermission>
                </div>
              </div>
              <div className="card-body">
                <div className="row col-md-12">
                  {error.status && (
                    <Alert
                      variant={error.type}
                      onClose={() =>
                        setError({ status: false, msg: "", type: "" })
                      }
                      dismissible
                    >
                      {error.msg}
                    </Alert>
                  )}
                  <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <input type="hidden" {...register("pages_id")} />
                    <Row>
                      <Col col={12}>
                        <Tabs
                          id="controlled-tab-example"
                          activeKey={key}
                          onSelect={(k) => setKey(k)}
                          className="mb-3"
                        >
                          {langList &&
                            langList.map((lang, index) => {
                              const {
                                languages_code,
                                languages_id,
                                languages_name,
                              } = lang;
                              return (
                                <Tab
                                  eventKey={languages_code}
                                  key={languages_id}
                                  title={languages_name}
                                >
                                  <Row>
                                    <Col col={12}>
                                      <FormGroup mb="20px">
                                        <Input
                                          id={`${Trans(
                                            "PAGE_TITLE",
                                            language
                                          )} (${languages_code})`}
                                          label={`${Trans(
                                            "PAGE_TITLE",
                                            language
                                          )} (${languages_code})`}
                                          placeholder={`${Trans(
                                            "PAGE_TITLE",
                                            language
                                          )} (${languages_code})`}
                                          hint="Enter text" // for bottom hint
                                          className="form-control"
                                          {...register(
                                            `pages_title_${languages_id}`,
                                            {
                                              required: Trans(
                                                "PAGE_TITLE_REQUIRED",
                                                language
                                              ),
                                            }
                                          )}
                                        />
                                        <span className="required">
                                          <ErrorMessage
                                            errors={errors}
                                            name={`pages_title_${languages_id}`}
                                          />
                                        </span>
                                      </FormGroup>
                                    </Col>

                                    <Col col={12}>
                                      <FormGroup>
                                        <Label>
                                          {`${Trans(
                                            "PAGES_CONTENT",
                                            language
                                          )} (${languages_code})`}
                                        </Label>
                                        <MyEditor
                                          setKey={`pages_content_${languages_id}`}
                                          setVal={
                                            getValues(
                                              `pages_content_${languages_id}`
                                            ) === undefined
                                              ? "<p></p>"
                                              : getValues(
                                                  `pages_content_${languages_id}`
                                                )
                                          }
                                          updateFun={(Key, Value) => {
                                            setValue(Key, Value);
                                          }}
                                        />
                                        <textarea
                                          {...register(
                                            `pages_content_${languages_id}`,
                                            {
                                              required: Trans(
                                                "PAGE_CONTENT_REQUIRED",
                                                language
                                              ),
                                            }
                                          )}
                                          style={{ display: "none" }}
                                        ></textarea>
                                        <span className="required">
                                          <ErrorMessage
                                            errors={errors}
                                            name={`pages_content_${languages_id}`}
                                          />
                                        </span>
                                      </FormGroup>
                                    </Col>

                                    <Col col={12}>
                                      <FormGroup mb="20px">
                                        <Input
                                          id={`${Trans(
                                            "SEO_META_TITLE",
                                            language
                                          )} (${languages_code})`}
                                          label={`${Trans(
                                            "SEO_META_TITLE",
                                            language
                                          )} (${languages_code})`}
                                          placeholder={`${Trans(
                                            "SEO_META_TITLE",
                                            language
                                          )} (${languages_code})`}
                                          className="form-control"
                                          {...register(
                                            `seometa_title_${languages_id}`
                                          )}
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col col={12}>
                                      <FormGroup mb="20px">
                                        <TextArea
                                          id={`${Trans(
                                            "SEO_META_DESCRIPTION",
                                            language
                                          )} (${languages_code})`}
                                          label={`${Trans(
                                            "SEO_META_DESCRIPTION",
                                            language
                                          )} (${languages_code})`}
                                          placeholder={`${Trans(
                                            "SEO_META_DESCRIPTION",
                                            language
                                          )} (${languages_code})`}
                                          hint="Enter text" // for bottom hint
                                          className="form-control"
                                          {...register(
                                            `seometa_desc_${languages_id}`
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

                      <Col col={12}>
                        <FormGroup mb="20px">
                          <Label htmlFor="status">
                            {Trans("STATUS", language)} :{" "}
                          </Label>
                          {"     "}
                          <input
                            type="radio"
                            {...register("status")}
                            defaultValue={1}
                            defaultChecked={true}
                          />
                          {"  "}
                          {Trans("ACTIVE", language)}
                          {"   "}
                          <input
                            type="radio"
                            {...register("status")}
                            defaultValue={0}
                          />{" "}
                          {Trans("INACTIVE", language)}
                        </FormGroup>
                      </Col>

                      <Col col={12} style={{ marginTop: "10px" }}>
                        <LoaderButton
                          formLoadStatus={formloadingStatus}
                          btnName={Trans("CREATE", language)}
                          className="btn btn-primary btn-block"
                        />
                      </Col>
                      <br />
                    </Row>
                  </form>
                </div>
              </div>
            </div>
          </CheckPermission>
        </div>
      </div>
    </Content>
  );
};

export default Edit;
