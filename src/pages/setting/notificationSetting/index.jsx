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
import { PagesStoreUrl, createSubCategoryUrl } from "config/index";
import { PageSetting } from "config/WebsiteUrl";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

    POST(PagesStoreUrl, saveFormData)
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
          navigate(`/pages-setting`);
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

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          { title: Trans("NOTIFICATION", language), link: "", class: "" },
        ]}
      />
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageCategories} PageAction={PreView}>
            <div className="card" id="custom-user-list">
              <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                <h6 className="tx-uppercase tx-semibold mg-b-0">
                  {Trans("Notification", language)}
                </h6>
                <div className="d-none d-md-flex">
                  <CheckPermission
                    PageAccess={PageCategories}
                    PageAction={PreAdd}
                  ></CheckPermission>
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
