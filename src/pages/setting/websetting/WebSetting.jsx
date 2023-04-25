import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { WebSettingUrl, WebSettingUpdateUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Create from "./Create";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Label,
  Input,
} from "component/UIElement/UIElement";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import Notify from "component/Notify";
import FeatherIcon from "feather-icons-react";
import { ErrorMessage } from "@hookform/error-message";
import EditComponent from "./EditComponent";

function WebSetting() {
  // const { langid, langKey } = useParams();
  const { apiToken, language, userType } = useSelector((state) => state.login);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const [listData, SetlistData] = useState([]);
  const [HelperData, SetHelperData] = useState([]);

  const methods = useForm();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = methods;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    let saveform = {};

    saveform.api_token = apiToken;
    saveform.formData = formData;

    POST(WebSettingUpdateUrl, saveform)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
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
          Notify(true, Trans(errObj.msg, language));
          // setError(errObj);
        }
      })
      .catch((error) => {
        console.log(error);
        SetformloadingStatus(false);
        Notify(true, Trans(error.message, language));
      });
  };

  const loadSettingData = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(WebSettingUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetlistData(data.data_list);
          SetHelperData(data.helperData);
        } else Notify(true, Trans(message, language));
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    loadSettingData();
    return () => abortController.abort();
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  useEffect(() => {}, [listData]);

  return (
    <Content>
      <CheckPermission IsPageAccess="subscription.view">
        {contentloadingStatus ? (
          <Loading />
        ) : (
          <React.Fragment>
            <PageHeader
              breadcumbs={[
                { title: Trans("DASHBOARD", language), link: "/", class: "" },
                { title: Trans("SETTING", language), link: "/", class: "" },
                {
                  title: Trans("WEB_SETTING", "language"),
                  link: "/",
                  class: "active",
                },
              ]}
            />

            <div className="row row-xs">
              <div className="col-sm-12 col-lg-12">
                <CheckPermission IsPageAccess="role.view">
                  <div className="card" id="custom-user-list">
                    <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                      <h6 className="tx-uppercase tx-semibold mg-b-0">
                        {Trans("WEB_SETTING", language)}
                      </h6>
                      <div className="d-none d-md-flex">
                        {userType !== "subscriber" && (
                          <Button variant="primary" onClick={handleModalShow}>
                            <FeatherIcon
                              icon="plus"
                              fill="white"
                              className="wd-10 mg-r-5"
                            />
                            {Trans("ADD_SETTING_KEY", language)}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="card-body">
                      <FormProvider {...methods}>
                        <form
                          action="#"
                          onSubmit={handleSubmit(onSubmit)}
                          noValidate
                        >
                          <Row>
                            <Col col={12}>
                              <EditComponent
                                fieldKey={listData}
                                HelperData={HelperData}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col col={3}>
                              <LoaderButton
                                formLoadStatus={formloadingStatus}
                                btnName={Trans("UPDATE", language)}
                                className="btn btn-primary btn-block"
                              />
                            </Col>
                          </Row>
                        </form>
                      </FormProvider>
                    </div>
                  </div>
                </CheckPermission>
              </div>
            </div>
          </React.Fragment>
        )}
      </CheckPermission>

      {/* add modal */}
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("ADD_SETTING_KEY", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Create
            loadSettingData={loadSettingData}
            handleModalClose={handleModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default WebSetting;
