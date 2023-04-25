import React, { useEffect, useState } from "react";
import { Row, Col } from "component/UIElement/UIElement";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { Trans } from "lang";

function SubcriberWebSetting({ fieldKey, currKey }) {
  const { language, userType } = useSelector((state) => state.login);

  const methods = useFormContext();

  const { register } = methods;

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

  return (
    <React.Fragment>

      <Row>
        {fieldKey.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <Col col={6}>
                <div className="form-group">
                  <label htmlFor="">
                    <b> {Trans(item.method_key, language)}: </b>
                  </label>
                  <input
                    {...register(`${item.method_key}`)}
                    placeholder={item.method_key}
                    className="form-control"
                    defaultValue={item.method_value}
                  />
                </div>
              </Col>
            </React.Fragment>
          );
        })}
      </Row>
    </React.Fragment>
  );
}

export default SubcriberWebSetting;
