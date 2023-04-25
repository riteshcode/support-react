import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  SettingKeyValueUrl,
  SettingKeyValueStoreUrl,
  SuperGeneralSettingUrl,
} from "config";
import POST from "axios/post";
import { useSelector, useDispatch } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Create from "./Create";
import { LoaderButton, Row, Col } from "component/UIElement/UIElement";
import { useForm, FormProvider } from "react-hook-form";
import Notify from "component/Notify";
import Group from "./Group";
import {
  updateLangState,
  updateSuperSettingState,
} from "redux/slice/loginSlice";

function AppSetting() {
  const dispatch = useDispatch();
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
    reset,
  } = methods;

  async function getGeneralSetting(lang) {
    await POST(SuperGeneralSettingUrl, {
      language: lang,
      lang_key: "backend",
    })
      .then((response) => {
        const dataVal = response.data.data.language_data.lang_value;
        const setting_data = response.data.data.setting_data;
        const formData = {
          lang: language,
          langDetails: dataVal,
        };
        dispatch(updateLangState(formData));
        dispatch(updateSuperSettingState(setting_data));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    let saveData = {};
    saveData.api_token = apiToken;
    saveData.formData = formData;

    POST(SettingKeyValueStoreUrl, saveData)
      .then((response) => {
        console.log("response", response);
        SetformloadingStatus(false);
        const { status, data, message } = response.data;
        if (status) {
          Notify(true, Trans(message, language));
          // if language updated
          let lang = language;
          if (data.hasOwnProperty("default_language"))
            lang = data["default_language"];

          getGeneralSetting(lang);
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
      userType: userType,
    };
    POST(SettingKeyValueUrl, filterData)
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
    reset();
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
                  title: Trans("WEBSITE", "language"),
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
                        {Trans("SETTING_LIST", language)}
                      </h6>
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
                              <Group
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

export default AppSetting;
