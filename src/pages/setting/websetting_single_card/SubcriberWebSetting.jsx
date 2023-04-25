import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { Row, Col } from "component/UIElement/UIElement";
import { useFormContext, useFieldArray } from "react-hook-form";
import { tempUploadFileUrl } from "config/index";
import { useSelector } from "react-redux";
import Notify from "component/Notify";

function SubcriberWebSetting({ fieldKey, HelperData }) {
  const { currency, language, country } = HelperData;

  const { apiToken, userType } = useSelector((state) => state.login);

  const methods = useFormContext();

  const { register, control, setValue } = methods;

  const { fields, replace } = useFieldArray({
    control,
    name: "settingdata",
  });

  useEffect(() => {
    fields(fieldKey);
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

  console.log("fields", fields);

  return (
    <React.Fragment>
      {fields.map((item, idx) => {
        return (
          <React.Fragment key={idx}>
            {/* Subscriber */}
            {userType == "subscriber" && (
              <Row key={idx}>
                <input
                  type="hidden"
                  {...register(`settingdata.${idx}.setting_id`)}
                />
                {verifyKey(item.setting_key) ? (
                  <React.Fragment>
                    <Col col={12}>
                      <label htmlFor="">
                        <b> {item.setting_key} : </b>
                      </label>
                      <select
                        {...register(`settingdata.${idx}.setting_value`)}
                        placeholder="Setting Value"
                        className="form-control"
                        defaultValue={item.setting_value}
                      >
                        {/* currency list */}
                        {item.setting_key === "default_currency" && currency && (
                          <React.Fragment>
                            <option value="">SELECT CURRENCY</option>
                            {currency.map((data, idx) => {
                              return (
                                <option value={data.value} key={idx}>
                                  {data.label}
                                </option>
                              );
                            })}
                          </React.Fragment>
                        )}

                        {/* language list */}
                        {item.setting_key === "default_language" && language && (
                          <React.Fragment>
                            <option value="">SELECT LANGUAGE</option>
                            {language.map((data, idx) => {
                              return (
                                <option value={data.value} key={idx}>
                                  {data.label}
                                </option>
                              );
                            })}
                          </React.Fragment>
                        )}

                        {/* COUNTRY list */}
                        {item.setting_key === "country" && country && (
                          <React.Fragment>
                            <option value="">SELECT COUNTRY</option>
                            {country.map((data, idx) => {
                              return (
                                <option value={data.value} key={idx}>
                                  {data.label}
                                </option>
                              );
                            })}
                          </React.Fragment>
                        )}
                      </select>
                    </Col>
                  </React.Fragment>
                ) : (
                  <Col col={12}>
                    <label htmlFor="">
                      <b> {item.setting_key} : </b>
                    </label>
                    {imageKey(item.setting_key) ? (
                      <React.Fragment>
                        <input
                          type="hidden"
                          {...register(`settingdata.${idx}.setting_value`)}
                        />
                        <input
                          placeholder="Setting Value"
                          className="form-control"
                          type="file"
                          onChange={(event) =>
                            HandleDocumentUpload(
                              event,
                              `settingdata.${idx}.fileupload`,
                              `settingdata.${idx}.setting_value`
                            )
                          }
                        />
                        <div id={`settingdata.${idx}.fileupload`}></div>
                      </React.Fragment>
                    ) : (
                      <input
                        {...register(`settingdata.${idx}.setting_value`)}
                        placeholder="Setting Value"
                        className="form-control"
                      />
                    )}
                  </Col>
                )}
              </Row>
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

export default SubcriberWebSetting;
