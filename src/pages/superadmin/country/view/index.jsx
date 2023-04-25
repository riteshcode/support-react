import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { languageDetailsUrl, translationUpdateUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { useParams } from "react-router-dom";
import { Anchor } from "component/UIElement/UIElement";
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
  const { langid, langKey } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [Datainfo, SetDataInfo] = useState();
  const [DataList, SetDataList] = useState();
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const htmlItem = [];

  const onSubmit = (formData) => {
    console.log(formData);
    SetformloadingStatus(true);

    const saveFormData = {};
    saveFormData.api_token = apiToken;
    saveFormData.translation_id = Datainfo.translation_id;
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
          setError(errObj);
        }
      })
      .catch((error) => {
        console.log(error);
        setError({
          status: true,
          msg: error.message,
          type: "danger",
        });
      });
  };

  const getData = () => {
    console.log("getData");
    const htmlItemList = [];

    POST(languageDetailsUrl, {
      languages_id: langid,
      lang_key: langKey,
    })
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetDataInfo(data);
          const listeim = JSON.parse(data.lang_value);
          console.log(listeim);
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
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    console.log("useEffect");
    getData();
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const deleteItem = (itemId) => {
    let res = window.confirm("Are you sure !");
    if (res) {
      // gettig translation details so that we can get object list with key:value
      let objectList = {};
      let translation_id = "";
      POST(languageDetailsUrl, {
        languages_id: langid,
        lang_key: langKey,
      })
        .then((response) => {
          const { data } = response.data;
          translation_id = data.translation_id;
          objectList = JSON.parse(data.lang_value);

          console.log("objectList", objectList);
          delete objectList[itemId];
          console.log("new objectList", objectList);

          const saveFormData = {};
          saveFormData.api_token = apiToken;
          saveFormData.translation_id = translation_id;
          saveFormData.lang_value = objectList;
          localStorage.setItem("language_list", JSON.stringify(objectList));

          POST(translationUpdateUrl, saveFormData)
            .then((response) => {
              const { message } = response.data;
              Notify(true, Trans("DELETE_SUCCESS_MSG", language));
              getData();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error("There was an error!", error);
          return false;
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
                  title: Trans("LANGUAGE", "en"),
                  link: "/superadmin/language",
                  class: "",
                },
                {
                  title:
                    Datainfo && Datainfo.language && Datainfo.language.name,
                  link: "",
                  class: "active",
                },
              ]}
              heading={Datainfo && Datainfo.lang_key}
              addButton={{
                label: "Add Translation",
                type: "function",
              }}
              addButtonFun={handleModalShow}
            />
            <div className="row row-xs">
              <div className="col-sm-12 col-lg-12">
                <CheckPermission IsPageAccess="role.view">
                  <div className="card" id="custom-user-list">
                    <div className="card-body">
                      <form
                        action="#"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                      >
                        <Row>
                          <Col col={12}>
                            <LoaderButton
                              formLoadStatus={formloadingStatus}
                              btnName={Trans("UPDATE", language)}
                              className="btn btn-primary btn-block"
                            />
                          </Col>
                        </Row>

                        {DataList}

                        <Row>
                          <Col col={12}>
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
          <Modal.Title>
            {Datainfo && Datainfo.lang_key}(
            {Datainfo && Datainfo.language && Datainfo.language.name})
          </Modal.Title>
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
