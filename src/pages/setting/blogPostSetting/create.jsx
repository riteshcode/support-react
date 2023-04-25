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
import { BlogPostStoreUrl, createSubCategoryUrl,tempUploadFileUrl } from "config/index";
import { BlogPostSetting } from 'config/WebsiteUrl';


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
import MyEditor from "component/MyEditor";

const Create = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);

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
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(false);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    console.log("saveFormData", saveFormData);

    POST(BlogPostStoreUrl, saveFormData)
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
        if (status) {
          SetlangList(data.language);
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      });
    return () => abortController.abort();
  }, []);

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
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          { title: Trans("POSTS", language), link: "", class: "" },
          { title: Trans("ADD", language), link: "", class: "active" },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageCategories} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("ADD_POSTS", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageCategories}
                    PageAction={PreAdd}
                  >
                    <Anchor
                      path={WebsiteLink(BlogPostSetting)}
                      variant="primary"
                    >
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
                    <Row>
                      <Col col={12}>
                        <Tabs
                          id="controlled-tab-example"
                          activeKey={key}
                          onSelect={(k) => setKey(k)}
                          className="mb-3"
                        >
                          {langList &&
                            langList.map((lang) => {
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
                                            "POST_TITLE",
                                            language
                                          )} (${languages_code})`}
                                          label={`${Trans(
                                            "POST_TITLE",
                                            language
                                          )} (${languages_code})`}
                                          placeholder={`${Trans(
                                            "POST_TITLE",
                                            language
                                          )} (${languages_code})`}
                                          hint="Enter text" // for bottom hint
                                          className="form-control"
                                          {...register(
                                            `post_title_${languages_id}`,
                                            {
                                              required: Trans(
                                                "POST_TITLE_REQUIRED",
                                                language
                                              ),
                                            }
                                          )}
                                        />
                                        <span className="required">
                                          <ErrorMessage
                                            errors={errors}
                                            name={`post_title_${languages_id}`}
                                          />
                                        </span>
                                      </FormGroup>
                                    </Col>
                                    <Col col={12}>
                                      <FormGroup>
                                        <Label>
                                          {`${Trans(
                                            "POST_CONTENT",
                                            language
                                          )} (${languages_code})`}
                                        </Label>
                                        <MyEditor
                                          setKey={`post_content_${languages_id}`}
                                          updateFun={(Key, Value) => {
                                            setValue(Key, Value);
                                          }}
                                        />
                                        <textarea
                                          {...register(
                                            `post_content_${languages_id}`
                                          )}
                                          style={{ display: "none" }}
                                        ></textarea>
                                      </FormGroup>
                                    </Col>
                                    <Col col={12}>
                                      <FormGroup mb="20px">
                                        <Input
                                          id={`${Trans(
                                            "POST_EXCERPT",
                                            language
                                          )} (${languages_code})`}
                                          label={`${Trans(
                                            "POST_EXCERPT",
                                            language
                                          )} (${languages_code})`}
                                          placeholder={`${Trans(
                                            "POST_EXCERPT",
                                            language
                                          )} (${languages_code})`}
                                          className="form-control"
                                          {...register(
                                            `post_excerpt_${languages_id}`
                                          )}
                                        />
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

                       <Col col={12} className="mb-10">
                            <label>
                             <b>
                           {Trans("POST_IMAGES")} <span className="error">*</span>{" "}
                            </b>
                          </label>
                          <input type="hidden" {...register(`img`)} />
                          <input
                            placeholder="Setting Value"
                            className="form-control"
                            type="file"
                            onChange={(event) =>
                              HandleDocumentUpload(event, `fileupload`, `img`)
                            }
                          />
                          <span className="infoInput"></span>
                          <div id={`fileupload`}></div>
                          </Col> 


                      <Col col={12} className="mt-5">
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

export default Create;
