import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { Row, Col } from "component/UIElement/UIElement";
import { useFormContext, useFieldArray } from "react-hook-form";
import { tempUploadFileUrl } from "config/index";
import { useSelector } from "react-redux";
import Notify from "component/Notify";
import { Trans } from "lang";

function SubcriberWebSetting({ fieldKey, HelperData, currKey }) {
  const { currency, language, country } = HelperData;

  const { apiToken, userType } = useSelector((state) => state.login);

  const methods = useFormContext();

  const { register, control, setValue } = methods;

  // const { fields, replace } = useFieldArray({
  //   control,
  //   name: "set",
  // });

  // useEffect(() => {
  //   replace(fieldKey);
  // }, [fieldKey]);

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
      ).innerHTML = ` <img src=${e.target.result} width="50" height="50" /> `;
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

  // console.log("fields", fieldKey);

  return (
    <React.Fragment>
      <Row>
        {fieldKey.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              {/* Subscriber */}
              {userType == "subscriber" && (
                <React.Fragment key={idx}>
                  <input
                    type="hidden"
                    {...register(`set_${currKey}.${idx}.setting_id`)}
                    defaultValue={item.setting_id}
                  />
                  <input
                    type="hidden"
                    {...register(`set_${currKey}.${idx}.setting_key`)}
                    defaultValue={item.setting_key}
                  />
                  {verifyKey(item.setting_key) ? (
                    <React.Fragment>
                      <Col col={6}>
                        <div class="form-group">
                          <label htmlFor="">
                            <b> {item.setting_key} : </b>
                          </label>
                          <select
                            {...register(`set_${currKey}.${idx}.setting_value`)}
                            placeholder="Setting Value"
                            className="form-control"
                            defaultValue={item.setting_value}
                          >
                            {/* currency list */}
                            {item.setting_key === "default_currency" &&
                              currency && (
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
                            {item.setting_key === "default_language" &&
                              language && (
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
                        </div>
                      </Col>
                    </React.Fragment>
                  ) : (
                    <Col col={6}>
                      <div class="form-group">
                        <label htmlFor="">
                          <b> {item.setting_key} : </b>
                        </label>
                        {imageKey(item.setting_key) ? (
                          <React.Fragment>
                            <input
                              type="hidden"
                              {...register(
                                `set_${currKey}.${idx}.setting_value`
                              )}
                              defaultValue={item.setting_value}
                            />

                            <div className="custom-file ">
                              <input
                                type="file"
                                className="custom-file-input"
                                id="customFile"
                                onChange={(event) =>
                                  HandleDocumentUpload(
                                    event,
                                    `set_${currKey}.${idx}.fileupload`,
                                    `set_${currKey}.${idx}.setting_value`
                                  )
                                }
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="customFile"
                              >
                                {Trans("IMAGE", language)}
                              </label>

                              <div
                                id={`set_${currKey}.${idx}.fileupload`}
                              ></div>
                            </div>
                          </React.Fragment>
                        ) : (
                          <input
                            {...register(`set_${currKey}.${idx}.setting_value`)}
                            placeholder="Setting Value"
                            className="form-control"
                            defaultValue={item.setting_value}
                          />
                        )}
                      </div>
                    </Col>
                  )}
                </React.Fragment>
              )}

              {/* Administroot */}

              {userType == "administrator" && (
                <Row key={idx}>
                  <input
                    type="hidden"
                    {...register(`set_${currKey}.${idx}.setting_id`)}
                    defaultValue={item.setting_id}
                  />
                  <Col col={4}>
                    <input
                      {...register(`set_${currKey}.${idx}.setting_key`)}
                      placeholder="Setting Key"
                      className="form-control"
                      defaultValue={item.setting_key}
                    />
                  </Col>
                  <Col col={4}>
                    <input
                      {...register(`set_${currKey}.${idx}.setting_name`)}
                      placeholder="Setting Name"
                      className="form-control"
                      defaultValue={item.setting_name}
                    />
                  </Col>
                  <Col col={4}>
                    <input
                      {...register(`set_${currKey}.${idx}.setting_value`)}
                      placeholder="Setting Value"
                      className="form-control"
                      defaultValue={item.setting_value}
                    />
                  </Col>
                </Row>
              )}
            </React.Fragment>
          );
        })}
      </Row>
    </React.Fragment>
  );
}

export default SubcriberWebSetting;
