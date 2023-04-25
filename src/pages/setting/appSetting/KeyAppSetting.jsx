import React from "react";
import POST from "axios/post";
import { Row, Col, TextArea } from "component/UIElement/UIElement";
import { useFormContext } from "react-hook-form";
import { tempUploadFileUrl } from "config/index";
import { useSelector } from "react-redux";
import Notify from "component/Notify";
import { Trans } from "lang";
import Select from "react-select";

function KeyAppSetting({ fieldKey, HelperData, currKey }) {
  const {
    currency,
    language,
    country,
    timezone,
    timeformat,
    dateformat,
    payment_methods,
    shipping_methods,
  } = HelperData;

  const { apiToken } = useSelector((state) => state.login);

  const methods = useFormContext();

  const { register, setValue } = methods;

  // select condition
  const conditionData = [
    "default_language",
    "default_currency",
    "country",
    "business_country",
    "per_page_item",
    "other_supported_currency",
    "other_supported_language",
    "time_zone",
    "time_format",
    "date_format",
    "payment_method_enable",
    "shipping_method_enable",
  ];
  const verifyKey = (key) => {
    return conditionData.includes(key);
  };

  // image show condition
  const imageShowList = ["application_logo", "website_favicon", "invoice_logo"];
  const imageKey = (key) => {
    return imageShowList.includes(key);
  };

  // select with only status
  const statusCond = [
    "invoice_show_biller_address",
    "invoice_show_bank_account",
    "invoice_send_reminder",
    "invoice_show_tax_number",
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
        setValue(StoreID, response.data.data);
      })
      .catch((error) => {
        Notify(false, error.message);
      });
  };

  const createSelectLabel = (data, selData = "") => {
    let labelData = [];
    let arrData = data.split(",");
    console.log("arrData", arrData);
    if (selData !== "") {
      for (let idx = 0; idx < selData.length; idx++) {
        const elVal = selData[idx]["value"];
        if (arrData.includes(elVal)) labelData.push(selData[idx]);
      }
    } else {
      for (let index = 0; index < arrData.length; index++) {
        labelData.push({
          label: arrData[index],
          value: arrData[index],
        });
      }
    }
    return labelData;
  };

  const handleMultiSelectChange = (id, newValue, actionMeta) => {
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    console.log(id, "-", listArr.join(","));
    setValue(id, listArr.join(","));
  };

  return (
    <React.Fragment>
      <Row>
        {fieldKey.map((item, idx) => {
          const imageName = `${item.setting_key}_image`;

          return (
            <React.Fragment key={idx}>
              {verifyKey(item.setting_key) ? (
                <React.Fragment>
                  <Col col={6}>
                    <div className="form-group">
                      <label htmlFor="">
                        <b> {Trans(item.setting_name, language)} :</b>
                      </label>
                      {/* { timezone} */}
                      {item.setting_key === "time_zone" && timezone && (
                        <React.Fragment>
                          <Select
                            name={item.setting_value}
                            options={timezone}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(newValue, actionMeta) => {
                              setValue(`${item.setting_key}`, newValue.value);
                            }}
                            defaultValue={createSelectLabel(
                              item.setting_value,
                              timezone
                            )}
                          />
                          <input
                            type="hidden"
                            {...register(`${item.setting_key}`)}
                            defaultValue={item.setting_value}
                          />
                        </React.Fragment>
                      )}
                      {/* currency list */}
                      {item.setting_key === "default_currency" && currency && (
                        <React.Fragment>
                          <Select
                            name={item.setting_value}
                            options={currency}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(newValue, actionMeta) => {
                              setValue(`${item.setting_key}`, newValue.value);
                            }}
                            defaultValue={createSelectLabel(
                              item.setting_value,
                              currency
                            )}
                          />
                          <input
                            type="hidden"
                            {...register(`${item.setting_key}`)}
                            defaultValue={item.setting_value}
                          />
                        </React.Fragment>
                      )}
                      {/* currency list */}
                      {item.setting_key === "payment_method_enable" &&
                        currency && (
                          <React.Fragment>
                            <Select
                              isMulti
                              name={item.setting_value}
                              options={payment_methods}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={(newValue, actionMeta) => {
                                handleMultiSelectChange(
                                  `${item.setting_key}`,
                                  newValue,
                                  actionMeta
                                );
                              }}
                              defaultValue={createSelectLabel(
                                item.setting_value,
                                payment_methods
                              )}
                            />
                            <input
                              type="hidden"
                              {...register(`${item.setting_key}`)}
                              defaultValue={item.setting_value}
                            />
                          </React.Fragment>
                        )}
                      {/*shipping key */}
                      {item.setting_key === "shipping_method_enable" &&
                        shipping_methods && (
                          <React.Fragment>
                            <Select
                              isMulti
                              name={item.setting_value}
                              options={shipping_methods}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={(newValue, actionMeta) => {
                                handleMultiSelectChange(
                                  `${item.setting_key}`,
                                  newValue,
                                  actionMeta
                                );
                              }}
                              defaultValue={createSelectLabel(
                                item.setting_value,
                                shipping_methods
                              )}
                            />
                            <input
                              type="hidden"
                              {...register(`${item.setting_key}`)}
                              defaultValue={item.setting_value}
                            />
                          </React.Fragment>
                        )}

                      {/* time_format list */}
                      {item.setting_key === "time_format" && timeformat && (
                        <React.Fragment>
                          <Select
                            name={item.setting_value}
                            options={timeformat}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(newValue, actionMeta) => {
                              setValue(`${item.setting_key}`, newValue.value);
                            }}
                            defaultValue={createSelectLabel(
                              item.setting_value,
                              timeformat
                            )}
                          />
                          <input
                            type="hidden"
                            {...register(`${item.setting_key}`)}
                            defaultValue={item.setting_value}
                          />
                        </React.Fragment>
                      )}
                      {/* dateformat list */}
                      {item.setting_key === "date_format" && dateformat && (
                        <React.Fragment>
                          <Select
                            name={item.setting_value}
                            options={dateformat}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(newValue, actionMeta) => {
                              setValue(`${item.setting_key}`, newValue.value);
                            }}
                            defaultValue={createSelectLabel(
                              item.setting_value,
                              dateformat
                            )}
                          />
                          <input
                            type="hidden"
                            {...register(`${item.setting_key}`)}
                            defaultValue={item.setting_value}
                          />
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
                                  `${item.setting_key}`,
                                  newValue,
                                  actionMeta
                                );
                              }}
                              defaultValue={createSelectLabel(
                                item.setting_value,
                                currency
                              )}
                            />
                            <input
                              type="hidden"
                              {...register(`${item.setting_key}`)}
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
                                  `${item.setting_key}`,
                                  newValue,
                                  actionMeta
                                );
                              }}
                              defaultValue={createSelectLabel(
                                item.setting_value,
                                language
                              )}
                            />
                            <input
                              type="hidden"
                              {...register(`${item.setting_key}`)}
                              defaultValue={item.setting_value}
                            />
                          </React.Fragment>
                        )}
                      {/* language list */}
                      {item.setting_key === "default_language" && language && (
                        <React.Fragment>
                          <Select
                            name={item.setting_value}
                            options={language}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(newValue, actionMeta) => {
                              setValue(`${item.setting_key}`, newValue.value);
                            }}
                            defaultValue={createSelectLabel(
                              item.setting_value,
                              language
                            )}
                          />
                          <input
                            type="hidden"
                            {...register(`${item.setting_key}`)}
                            defaultValue={item.setting_value}
                          />
                        </React.Fragment>
                      )}

                      {/* COUNTRY list */}
                      {item.setting_key === "country" && country && (
                        <React.Fragment>
                          <Select
                            name={item.setting_value}
                            options={country}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(newValue, actionMeta) => {
                              setValue(`${item.setting_key}`, newValue.value);
                            }}
                            defaultValue={createSelectLabel(
                              item.setting_value,
                              country
                            )}
                          />
                          <input
                            type="hidden"
                            {...register(`${item.setting_key}`)}
                            defaultValue={item.setting_value}
                          />
                        </React.Fragment>
                      )}
                      {/* business_country list */}
                      {item.setting_key === "business_country" && country && (
                        <React.Fragment>
                          <Select
                            name={item.setting_value}
                            options={country}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="select"
                            onChange={(newValue, actionMeta) => {
                              setValue(`${item.setting_key}`, newValue.value);
                            }}
                            defaultValue={createSelectLabel(
                              item.setting_value,
                              country
                            )}
                          />
                          <input
                            type="hidden"
                            {...register(`${item.setting_key}`)}
                            defaultValue={item.setting_value}
                          />
                        </React.Fragment>
                      )}
                      {/* per_page_item list */}
                      {item.setting_key === "per_page_item" && (
                        <React.Fragment>
                          <select
                            {...register(`${item.setting_key}`)}
                            placeholder="Setting Value"
                            className="form-control"
                            defaultValue={item.setting_value}
                          >
                            <option value="">SELECT</option>

                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
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
                            <b> {Trans(item.setting_name, language)} :</b>
                          </label>

                          {/* switch case i nreact */}
                          {(() => {
                            switch (item.setting_key) {
                              case "date_format":
                                return (
                                  <React.Fragment>
                                    <select
                                      {...register(
                                        `set_${currKey}.${idx}.
                                            `
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
                              default:
                                return (
                                  <React.Fragment>
                                    <select
                                      {...register(`${item.setting_key}`)}
                                      placeholder="Setting Value"
                                      className="form-control"
                                      defaultValue={item.setting_value}
                                    >
                                      <option value="">SELECT</option>
                                      <option value={0}>Yes</option>
                                      <option value={1}>No</option>
                                    </select>
                                  </React.Fragment>
                                );
                            }
                          })()}
                        </div>
                      </Col>
                    </React.Fragment>
                  ) : (
                    <Col col={6}>
                      <div className="form-group">
                        <label htmlFor="">
                          <b> {Trans(item.setting_name, language)} : </b>
                        </label>
                        {item.option_type === "image" ? (
                          <React.Fragment>
                            <input
                              type="hidden"
                              {...register(`${item.setting_key}`)}
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
                                    `${item.setting_key}`
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
                                    height="50px"
                                  />
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            {item.option_type === "textarea" ? (
                              <React.Fragment>
                                <TextArea
                                  {...register(`${item.setting_key}`)}
                                  placeholder={Trans(
                                    item.setting_name,
                                    language
                                  )}
                                  className="form-control"
                                  defaultValue={item.setting_value}
                                />
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <input
                                  {...register(`${item.setting_key}`)}
                                  placeholder={Trans(
                                    item.setting_name,
                                    language
                                  )}
                                  type={item.option_type}
                                  className="form-control"
                                  defaultValue={item.setting_value}
                                />
                              </React.Fragment>
                            )}
                          </React.Fragment>
                        )}
                      </div>
                    </Col>
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

export default KeyAppSetting;
