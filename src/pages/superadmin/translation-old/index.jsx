import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  translationEditKeysValueUrl,
  translationUpdateUrl,
  translationDeleteKeyUrl,
  languageUrlAll,
} from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { useParams } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Create from "./create";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
} from "component/UIElement/UIElement";
import { useForm } from "react-hook-form";
import Notify from "component/Notify";

function Index() {
  // const { langid, langKey } = useParams();

  const [langid, Setlangid] = useState("en");
  const [langKey, SetlangKey] = useState("website");

  const { apiToken, language } = useSelector((state) => state.login);
  const [Datainfo, SetDataInfo] = useState();
  const [DataList, SetDataList] = useState();
  const [languageListData, SetLanguageListData] = useState();
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = {};
    saveFormData.api_token = apiToken;
    saveFormData.languages_id = Datainfo.languages_id;
    saveFormData.lang_key = "website";
    saveFormData.lang_value = formData;

    localStorage.setItem("language_list", JSON.stringify(formData));

    POST(translationUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
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

  const getData = () => {
    const htmlItemList = [];
    POST(translationEditKeysValueUrl, {
      languages_id: langid,
      lang_key: langKey,
      api_token: apiToken,
    })
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetDataInfo(data);
          const listeim = data.all_key_value_pair;
          if (listeim) {
            for (const Ikey in listeim) {
              htmlItemList.push(
                <Row key={Ikey}>
                  <Col col={3}>
                    <label htmlFor="">{Ikey}</label>
                  </Col>
                  <Col col={8}>
                    <FormGroup mb="20px">
                      <input
                        id="language_code"
                        type="text"
                        placeholder="Enter.."
                        hint="Enter text" // for bottom hint
                        className="form-control"
                        {...register(`${Ikey}`, {
                          required: "Language short code is required",
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={1}>
                    <FeatherIcon
                      icon="trash-2"
                      fill="white"
                      onClick={() => deleteItem(Ikey)}
                    />
                  </Col>
                </Row>
              );
              setValue(Ikey, listeim[Ikey]);
            }
          }
          console.log("htmlItemList", htmlItemList);
          SetDataList(htmlItemList);
        } else alert(message);
      })
      .catch((error) => {
        Notify(false, Trans(error.message, language));
      });
  };

  const getTrasnlationData = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(languageUrlAll, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        console.log(data);
        if (status) {
          SetloadingStatus(false);
          SetLanguageListData(data);
        } else alert(message);
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getTrasnlationData();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    let abortController = new AbortController();
    getData();
    return () => abortController.abort();
  }, [langid]);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const deleteItem = (keyName) => {
    let res = window.confirm("Are you sure !");
    if (res) {
      POST(translationDeleteKeyUrl, {
        api_token: apiToken,
        translation_key: keyName,
      })
        .then((response) => {
          const { message, data } = response.data;
          Notify(true, Trans(message, language));
          getData();
        })
        .catch((error) => {
          Notify(false, Trans(error.message, language));
        });
    }
  };

  return (
    <Content>
      <CheckPermission IsPageAccess="subscription.view">
        {contentloadingStatus ? (
          <Loading />
        ) : (
          <>
            <PageHeader
              breadcumbs={[
                { title: Trans("DASHBOARD", language), link: "/", class: "" },
                {
                  title: Trans("TRANSLATION", "language"),
                  link: "/",
                  class: "active",
                },
              ]}
              addButton={{
                label: Trans("ADD_KEY", language),
                type: "function",
              }}
              addButtonFun={handleModalShow}
            />
            <div className="row row-xs">
              <div className="col-sm-12 col-lg-12">
                <CheckPermission IsPageAccess="role.view">
                  <div className="card" id="custom-user-list">
                    <div className="card-body">
                      <Row>
                        <Col col={4}>
                          <FormGroup mb="20px">
                            {languageListData && (
                              <select
                                defaultValue={langid}
                                className="form-control"
                                onChange={(e) => {
                                  Setlangid(e.target.value);
                                }}
                              >
                                <option>
                                  {Trans("SELECT_LANG", language)}
                                </option>
                                {languageListData.map((data, idex) => {
                                  return (
                                    <option
                                      key={idex}
                                      value={data.languages_code}
                                    >
                                      {data.languages_name}
                                    </option>
                                  );
                                })}
                              </select>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>

                      <form
                        action="#"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                      >
                        <Row>
                          <Col col={3}>
                            <LoaderButton
                              formLoadStatus={formloadingStatus}
                              btnName={Trans("UPDATE", language)}
                              className="btn btn-primary btn-block"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col col={10}>{DataList}</Col>
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
                    </div>
                  </div>
                </CheckPermission>
              </div>
            </div>
          </>
        )}
      </CheckPermission>

      {/* add modal */}
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("ADD_KEY", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Create
            datainfo={Datainfo}
            getData={getData}
            handleModalClose={handleModalClose}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </Content>
  );
}

export default Index;
