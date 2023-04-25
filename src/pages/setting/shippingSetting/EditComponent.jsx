import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { Row, Col } from "component/UIElement/UIElement";
import { useFormContext, useFieldArray } from "react-hook-form";
import { tempUploadFileUrl } from "config/index";
import { useSelector } from "react-redux";
import Notify from "component/Notify";
import SubcriberWebSetting from "./SubcriberWebSetting";
import { Alert, Tab, Tabs } from "react-bootstrap";

function EditComponent({ fieldKey, HelperData }) {
  const { apiToken, userType } = useSelector((state) => state.login);

  const methods = useFormContext();

  const { register, control, setValue } = methods;

  // for tab sysytem
  const [key, setKey] = useState(0);

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
      <Tabs
        defaultActiveKey={`set_0`}
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        {fieldKey.map((item, idx) => {
          return (
            <Tab eventKey={`set_${idx}`} key={idx} title={item.method_name}>
              <SubcriberWebSetting
                fieldKey={item.payment_methods_details}
                HelperData={HelperData}
                currKey={item.payment_method_id}
              />
            </Tab>
          );
        })}
      </Tabs>
    </React.Fragment>
  );
}

export default EditComponent;
