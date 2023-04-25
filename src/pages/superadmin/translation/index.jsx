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
  const [langKey, SetlangKey] = useState("backend");

  const { apiToken, language } = useSelector((state) => state.login);
  const [Datainfo, SetDataInfo] = useState();
  const [DataList, SetDataList] = useState();
  const [languageListData, SetLanguageListData] = useState();
  const [sourceListData, SetSourceListData] = useState();
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, reset, handleSubmit, setValue } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = {};
    saveFormData.api_token = apiToken;
    saveFormData.language_code = langid;
    saveFormData.lang_key = langKey;
    saveFormData.lang_value = formData;

    // console.log("saveFormData", saveFormData);
    // return "";

    localStorage.setItem("language_list", JSON.stringify(formData));

    POST(translationUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        // console.log(response);
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
        // console.log(error);
        SetformloadingStatus(false);
        Notify(true, Trans(error.message, language));
      });
  };

  const getData = () => {
    reset(); // reset old value

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
          const listeim = data.group_key;
          if (listeim) {
            for (const Ikey in listeim) {
              let groupKeyList = [];

              let groupKey = listeim[Ikey]["all_trans_key_val_pair"];

              if (groupKey) {
                for (const Gkey in groupKey) {
                  groupKeyList.push(
                    <Row key={Gkey}>
                      <Col col={4}>
                        <label htmlFor="">{Gkey}</label>
                      </Col>
                      <Col col={7}>
                        <FormGroup mb="20px">
                          <input
                            type="text"
                            placeholder="Enter.."
                            hint="Enter text" // for bottom hint
                            className="form-control"
                            {...register(`${Gkey}`, {
                              required: "required",
                            })}
                          />
                        </FormGroup>
                      </Col>
                      <Col col={1}>
                        <FeatherIcon
                          icon="trash-2"
                          fill="white"
                          onClick={() => deleteItem(Gkey)}
                        />
                      </Col>
                    </Row>
                  );
                  setValue(Gkey, groupKey[Gkey]);
                }
              }

              htmlItemList.push(
                <Row key={Ikey}>
                  <Col col={12}>
                    <h6 htmlFor="">
                      <b>{listeim[Ikey]["group_name"]}</b>
                    </h6>
                  </Col>
                  <Col col={12}>{groupKeyList}</Col>
                </Row>
              );
            }
          }

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
        // console.log(data);
        if (status) {
          SetloadingStatus(false);
          SetLanguageListData(data);
          SetSourceListData(data);
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
  }, [langid, langKey]);

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
          <React.Fragment>
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
                      <form>
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
                          <Col col={4}>
                            <FormGroup mb="20px">
                              <select
                                className="form-control"
                                onChange={(e) => {
                                  SetlangKey(e.target.value);
                                }}
                                defaultValue={langKey}
                              >
                                <option>
                                  {Trans("SELECT_SOURCE", language)}
                                </option>
                                <option value="website">Website</option>
                                <option value="backend">Backend</option>
                                <option value="landing">Landing</option>
                              </select>
                            </FormGroup>
                          </Col>
                        </Row>
                      </form>

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
                          <Col col={12}>{DataList}</Col>
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
          </React.Fragment>
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
