import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { Row, Col } from "component/UIElement/UIElement";
import { useFormContext, useFieldArray } from "react-hook-form";
import { tempUploadFileUrl } from "config/index";
import { useSelector } from "react-redux";
import Notify from "component/Notify";

function EditComponent({ fieldKey, HelperData }) {
  // console.log("fieldKey", fieldKey);
  // const { currency, language, country } = HelperData;

  const { apiToken, userType } = useSelector((state) => state.login);

  const methods = useFormContext();

  const { register, control, setValue } = methods;

  const { fields, replace } = useFieldArray({
    control,
    name: "settingdata",
  });

  useEffect(() => {
    replace(fieldKey);
  }, [fieldKey]);

  // select condition
  const conditionData = ["default_language", "default_currency", "country"];
  const verifyKey = (key) => {
    return conditionData.includes(key);
  };

  // image show condition
  const imageShowList = ["website_logo", "website_favicon", "preloader_image"];
  const imageKey = (key) => {
    return imageShowList.includes(key);
  };

  // handle logo and other file upload

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
    <React.Fragment>
      {fields.map((item, idx) => {
        return (
          <React.Fragment key={idx}>
            <Row>
              <Col col={3}>
                <label htmlFor="">
                  <b> {item.position?.position_name} : </b>
                </label>
              </Col>
              <Col col={9}>
                <input
                  type="hidden"
                  {...register(`settingdata.${idx}.images_id`)}
                />
                <input
                  placeholder="Setting Value"
                  className="form-control"
                  type="file"
                  onChange={(event) =>
                    HandleDocumentUpload(
                      event,
                      `settingdata.${idx}.fileupload`,
                      `settingdata.${idx}.images_id`
                    )
                  }
                />
                <span className="infoInput">{item.comment}</span>
                <div id={`settingdata.${idx}.fileupload`}>
                  <a href={item.image} download={true} target="_blank">
                    Preview
                  </a>
                </div>
              </Col>
            </Row>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

export default EditComponent;
