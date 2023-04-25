import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { Row, Col } from "component/UIElement/UIElement";
import { useFormContext, useFieldArray } from "react-hook-form";
import { tempUploadFileUrl } from "config/index";
import { useSelector } from "react-redux";
import Notify from "component/Notify";
import { Trans } from "lang";
import Select from "react-select";

function SubcriberWebSetting({ fieldKey, HelperData, currKey }) {
  console.log(fieldKey);
  const { currency, language, country, timezone } = HelperData;

  const { apiToken, userType } = useSelector((state) => state.login);

  const methods = useFormContext();

  const { register, control, setValue } = methods;

  // select condition
  const conditionData = [
    "default_language",
    "default_currency",
    "country",
    "other_supported_currency",
    "other_supported_language",
    "time_zone",
    "method_key",
  ];
  const verifyKey = (key) => {
    return conditionData.includes(key);
  };

  // image show condition
  const imageShowList = ["website_logo", "website_favicon", "preloader_image"];
  const imageKey = (key) => {
    return imageShowList.includes(key);
  };

  // select with only status
  const statusCond = [
    "facebook_status",
    "google_status",
    "twitter_status",
    "linkedin_status",
    "guest_checkout",
    "date_format",
    "show_preloader",
    "currency_symbol_position",
    "currency_decimal_point",
    "mail_protocol",
  ];
  const statusKey = (key) => {
    return statusCond.includes(key);
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

  const createSelectLabel = (data) => {
    let labelData = [];
    let arrData = data.split(",");
    for (let index = 0; index < arrData.length; index++) {
      labelData.push({
        label: arrData[index],
        value: arrData[index],
      });
    }
    return labelData;
  };

  const handleMultiSelectChange = (id, newValue, actionMeta) => {
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    setValue(id, listArr.join(","));
  };

  return (
    <React.Fragment>
      <Row>
        {fieldKey.map((item, idx) => {
          const imageName = `${item.setting_key}_image`;
        
          return (
            <React.Fragment key={idx}>
              {/* Subscriber */}
              {userType == "subscriber" && (
                <React.Fragment key={idx}>
                  <input
                    type="hidden"
                    {...register(`set_${currKey}.${idx}.payment_method_id`)}
                    defaultValue={item.payment_method_id}
                  />
                  <input
                    type="hidden"
                    {...register(`set_${currKey}.${idx}.method_key`)}
                    defaultValue={item.method_key}
                  />
                  {verifyKey(item.setting_key) ? (
                    <React.Fragment>
                      <Col col={6}>
                        <div className="form-group">
                          <label htmlFor="">
                            <b>  {Trans(item.method_key, language)} :</b>
                          </label>
                          {/* { timezone} */}
                          {item.method_key === "time_zone" && timezone && (
                            <React.Fragment>
                              <select
                                {...register(
                                  `set_${currKey}.${idx}.method_name`
                                )}
                                placeholder="Setting Value"
                                className="form-control"
                                defaultValue={item.method_name}
                              >
                                <option value="">SELECT TIMEZONE</option>
                                {timezone.map((data, idx) => {
                                  return (
                                    <option value={data.value} key={idx}>
                                      {data.label}
                                    </option>
                                  );
                                })}
                              </select>
                            </React.Fragment>
                          )}

                          {/* currency list */}
                          {item.setting_key === "default_currency" && currency && (
                            <React.Fragment>
                              <select
                                {...register(
                                  `set_${currKey}.${idx}.setting_value`
                                )}
                                placeholder="Setting Value"
                                className="form-control"
                                defaultValue={item.setting_value}
                              >
                                <option value="">SELECT CURRENCY</option>
                                {currency.map((data, idx) => {
                                  return (
                                    <option value={data.value} key={idx}>
                                      {data.label}
                                    </option>
                                  );
                                })}
                              </select>
                            </React.Fragment>
                          )}

                          {/* currency list */}
                          {item.setting_key === "other_supported_currency" &&
                            currency && (
                              <React.Fragment>
                                <Select
                                  isMulti
                                  name={item.setting_value}
                                  options={currency}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  onChange={(newValue, actionMeta) => {
                                    handleMultiSelectChange(
                                      `set_${currKey}.${idx}.setting_value`,
                                      newValue,
                                      actionMeta
                                    );
                                  }}
                                  defaultValue={createSelectLabel(
                                    item.setting_value
                                  )}
                                />
                                <input
                                  type="hidden"
                                  {...register(
                                    `set_${currKey}.${idx}.setting_value`
                                  )}
                                  defaultValue={item.setting_value}
                                />
                              </React.Fragment>
                            )}

                          {item.setting_key === "other_supported_language" &&
                            currency && (
                              <React.Fragment>
                                <Select
                                  isMulti
                                  name={item.setting_value}
                                  options={language}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  onChange={(newValue, actionMeta) => {
                                    handleMultiSelectChange(
                                      `set_${currKey}.${idx}.setting_value`,
                                      newValue,
                                      actionMeta
                                    );
                                  }}
                                  defaultValue={createSelectLabel(
                                    item.setting_value
                                  )}
                                />
                                <input
                                  type="hidden"
                                  {...register(
                                    `set_${currKey}.${idx}.setting_value`
                                  )}
                                  defaultValue={item.setting_value}
                                />
                              </React.Fragment>
                            )}

                          {/* language list */}
                          {item.setting_key === "default_language" && language && (
                            <React.Fragment>
                              <select
                                {...register(
                                  `set_${currKey}.${idx}.setting_value`
                                )}
                                placeholder="Setting Value"
                                className="form-control"
                                defaultValue={item.setting_value}
                              >
                                <option value="">SELECT LANGUAGE</option>
                                {language.map((data, idx) => {
                                  return (
                                    <option value={data.value} key={idx}>
                                      {data.label}
                                    </option>
                                  );
                                })}
                              </select>
                            </React.Fragment>
                          )}

                          {/* COUNTRY list */}
                          {item.setting_key === "country" && country && (
                            <React.Fragment>
                              <select
                                {...register(
                                  `set_${currKey}.${idx}.setting_value`
                                )}
                                placeholder="Setting Value"
                                className="form-control"
                                defaultValue={item.setting_value}
                              >
                                <option value="">SELECT COUNTRY</option>
                                {country.map((data, idx) => {
                                  return (
                                    <option value={data.value} key={idx}>
                                      {data.label}
                                    </option>
                                  );
                                })}
                              </select>
                            </React.Fragment>
                          )}
                        </div>
                      </Col>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {statusKey(item.setting_key) ? (
                        <React.Fragment>
                          <Col col={6}>
                            <div className="form-group">
                              <label htmlFor="">
                                <b> {Trans(item.setting_key, language)} :</b>
                              </label>

                              {/* switch case i nreact */}
                              {(() => {
                                switch (item.setting_key) {
                                  case "method_key":
                                    return (
                                      <React.Fragment>
                                        <select
                                          {...register(
                                            `set_${currKey}.${idx}.setting_value`
                                          )}
                                          placeholder="Setting Value"
                                          className="form-control"
                                          defaultValue={item.setting_value}
                                        >
                                          <option value="">SELECT</option>

                                          <option value="DD/MM/YYYY">
                                            DD/MM/YYYY
                                          </option>
                                          <option value="YYYY/MM/DD">
                                            YYYY/MM/DD
                                          </option>
                                          <option value="MM/DD/YYYY">
                                            MM/DD/YYYY
                                          </option>
                                        </select>
                                      </React.Fragment>
                                    );
                                  case "currency_decimal_point":
                                    return (
                                      <React.Fragment>
                                        <select
                                          {...register(
                                            `set_${currKey}.${idx}.setting_value`
                                          )}
                                          placeholder="Setting Value"
                                          className="form-control"
                                          defaultValue={item.setting_value}
                                        >
                                          <option value="">SELECT</option>
                                          <option value="2">2</option>
                                          <option value="4">4</option>
                                        </select>
                                      </React.Fragment>
                                    );
                                  case "mail_protocol":
                                    return (
                                      <React.Fragment>
                                        <select
                                          {...register(
                                            `set_${currKey}.${idx}.setting_value`
                                          )}
                                          placeholder="Setting Value"
                                          className="form-control"
                                          defaultValue={item.setting_value}
                                        >
                                          <option value="">SELECT</option>
                                          <option value="SENDMAIL">
                                            sendmail
                                          </option>
                                          <option value="SMTP">SMTP</option>
                                        </select>
                                      </React.Fragment>
                                    );
                                  case "currency_symbol_position":
                                    return (
                                      <React.Fragment>
                                        <select
                                          {...register(
                                            `set_${currKey}.${idx}.setting_value`
                                          )}
                                          placeholder="Setting Value"
                                          className="form-control"
                                          defaultValue={item.setting_value}
                                        >
                                          <option value="">SELECT</option>
                                          <option value="LEFT">left</option>
                                          <option value="RIGHT">Right</option>
                                        </select>
                                      </React.Fragment>
                                    );

                                  default:
                                    return (
                                      <React.Fragment>
                                        <select
                                          {...register(
                                            `set_${currKey}.${idx}.setting_value`
                                          )}
                                          placeholder="Setting Value"
                                          className="form-control"
                                          defaultValue={item.setting_value}
                                        >
                                          <option value="">SELECT</option>
                                          <option value={1}>On</option>
                                          <option value={0}>Off</option>
                                        </select>
                                      </React.Fragment>
                                    );
                                }
                              })()}

                              {/* language list */}
                              {/* {item.setting_key === "date_format" ? (
                                
                              ) : (
                                
                              )} */}
                            </div>
                          </Col>
                        </React.Fragment>
                      ) : (
                        <Col col={6}>
                          <div className="form-group">
                            <label htmlFor="">
                              <b>  {Trans(item.method_key, language)}: </b>
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
                                    {"  "}
                                  </label>

                                  <div id={`set_${currKey}.${idx}.fileupload`}>
                                    {item[imageName] !== "" && (
                                      <img
                                        src={item[imageName]}
                                        alt={item[imageName]}
                                      />
                                    )}
                                  </div>
                                </div>
                              </React.Fragment>
                            ) : (
                              <input
                                {...register(
                                  `set_${currKey}.${idx}.setting_value`
                                )}
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
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}
      </Row>
    </React.Fragment>
  );
}

export default SubcriberWebSetting;
