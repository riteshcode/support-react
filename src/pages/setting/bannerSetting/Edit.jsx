import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  BannerUpdateUrl,
  BannerGroupUrl,
  BannerEditUrl,
  tempUploadFileUrl,
} from "config/index";
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

  // image show condition
  const imageShowList = ["image"];
  const imageKey = (key) => {
    return imageShowList.includes(key);
  };

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;
    POST(BannerUpdateUrl, formData)
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
  const ModuleLoad = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(BannerGroupUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetSectionListing(data.data_list);
          setValueToField();
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });
  };

  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [editInfo, SeteditInfo] = useState("");

  function setValueToField() {
    const editInfo = {
      api_token: apiToken,
      banners_id: editData,
    };

    POST(BannerEditUrl, editInfo)
      .then((response) => {
        SetloadingStatus(false);
        const { data } = response.data;
        SeteditInfo(data);
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

  const HandleDocumentUpload = (event, previewUrlId, StoreID) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;

    var readers = new FileReader();
    readers.onload = function (e) {
      console.log("filereade", e);
      document.getElementById(
        previewUrlId
      ).innerHTML = `<img src=${e.target.result} height="100" />`;
    };
    readers.readAsDataURL(event.target.files[0]);

    // upload temp image and bind value to array
    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", event.target.files[0]);
    formdata.append("images_type", 1);
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
        <input type="hidden" {...register("banners_id")} />
        <Row>
          <Col col={12}>
            <FormGroup mb="20px">
              <Label
                display="block"
                mb="5px"
                htmlFor={Trans("BANNER_GROUP", language)}
              >
                {Trans("BANNER_GROUP", language)}
              </Label>
              <select
                id={Trans("BANNER_GROUP", language)}
                placeholder={Trans("BANNER_GROUP", language)}
                className="form-control"
                {...register("banners_group_id", {
                  required: Trans("SELECT_BANNER_GROUP_REQUIRED", language),
                })}
              >
                <option value="">
                  {Trans("SELECT_BANNER_GROUP", language)}
                </option>
                {sectionListing &&
                  sectionListing.map((curr, idx) => (
                    <option value={curr.banners_group_id} key={idx}>
                      {curr.group_name}
                    </option>
                  ))}
              </select>
              <span className="required">
                <ErrorMessage errors={errors} name="banners_group_id" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BANNER_TITLE", language)}
                label={Trans("BANNER_TITLE", language)}
                placeholder={Trans("BANNER_TITLE", language)}
                className="form-control"
                {...register("banners_title", {
                  required: Trans("BANNER_TITLE_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="banners_title" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id={Trans("BANNER_URL", language)}
                label={Trans("BANNER_URL", language)}
                placeholder={Trans("BANNER_URL", language)}
                className="form-control"
                {...register("banners_url", {
                  required: Trans("BANNER_URL_REQUIRED", language),
                })}
                defaultValue="#"
              />
              <span className="required">
                <ErrorMessage errors={errors} name="banners_url" />
              </span>
            </FormGroup>
          </Col>
          <Col col={12} className="mb-10">
            <FormGroup>
              <Label display="block" mb="5px" htmlFor={"fileupload"}>
                {Trans("BANNER_IMAGES", language)}
              </Label>
              <div className="custom-file">
                <input type="hidden" {...register("banners_image")} />

                <input
                  type="file"
                  className="custom-file-input"
                  id="customFile"
                  onChange={(event) =>
                    HandleDocumentUpload(event, "fileupload", "banners_image")
                  }
                />
                <label className="custom-file-label" htmlFor="customFile">
                  {Trans("BANNER_IMAGES", language)}
                </label>
                <div id={"fileupload"}>
                  <img src={editInfo.image} height="100" />
                </div>
              </div>
            </FormGroup>
          </Col>
          <Col col={12} style={{ marginTop: "5%" }}></Col>
          <br />
          <Col col={12}>
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
