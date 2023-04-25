import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import {
  BannerStoreUrl,
  BannerGroupUrl,
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

const Create = (props) => {
  const { bannerGroupId } = useParams();

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
    handleSubmit,
  } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;
    POST(BannerStoreUrl, formData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: Trans(message, language),
            type: "success",
          });
          props.handleModalClose();
          props.loadSettingData();
          props.filterItem();
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
        console.log("BannerGroupUrl", data);
        if (status) {
          SetSectionListing(data.data_list);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        Notify(false, Trans(error.message, language));
      });
  };

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
    <>
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
        <input
          type="hidden"
          {...register("banners_group_id")}
          defaultValue={bannerGroupId}
        />
        <Row>
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
            <div className="custom-file ">
              <input
                type="hidden"
                {...register("banners_image", {
                  required: Trans("BANNER_IMAGE_REQUIRED", language),
                })}
              />
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={(event) =>
                  HandleDocumentUpload(event, `fileupload`, `banners_image`)
                }
              />
              <label className="custom-file-label" htmlFor="customFile">
                {Trans("BANNER_IMAGES", language)}
                {"  "}
              </label>

              <div id={`fileupload`}></div>
            </div>

            <span className="required">
              <ErrorMessage errors={errors} name="banners_image" />
            </span>
          </Col>
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
          <br />
          <Col col={12}>
            <LoaderButton
              formLoadStatus={formloadingStatus}
              btnName={Trans("CREATE", language)}
              className="btn btn-primary btn-block"
            />
          </Col>
        </Row>
      </form>
    </>
  );
};

export default Create;
