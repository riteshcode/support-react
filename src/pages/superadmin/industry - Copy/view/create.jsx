import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { translationUpdateUrl } from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  TextArea,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";

const Create = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit, getValues } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const { translation_id, lang_value } = props.datainfo;
    const OldJson = JSON.parse(lang_value);

    const transKey = getValues("lang_key");
    const transValue = getValues("lang_value");
    console.log(transKey);

    const transKeyCheck = transKey.search(",");
    const transValCheck = transKey.search(",");
    if (transKeyCheck === -1 || transValue === -1) {
      if (transKey in OldJson) {
        setError({
          status: true,
          msg: "Already Key Exists",
          type: "danger",
        });
        SetformloadingStatus(false);
        return null;
      }
      OldJson[transKey.trim()] = transValue;
    } else {
      //explode , to makearray
      const keys = transKey.split(",");
      const values = transValue.split(",");
      if (keys.length !== values.length) {
        setError({
          status: true,
          msg: "Key value pair not matched ! ",
          type: "danger",
        });
        SetformloadingStatus(false);
        return null;
      }

      for (let index = 0; index < keys.length; index++) {
        if (keys[index] in OldJson) continue;
        else OldJson[keys[index].trim()] = values[index];
      }

      console.log(keys);
      console.log(values);
    }
    // console.log(OldJson);
    // return "";

    const saveFormData = {};
    saveFormData.api_token = apiToken;
    saveFormData.translation_id = translation_id;
    saveFormData.lang_value = OldJson;
    console.log(saveFormData);

    localStorage.setItem("language_list", JSON.stringify(OldJson));

    POST(translationUpdateUrl, saveFormData)
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
          props.getData();
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
        setError({
          status: true,
          msg: error.message,
          type: "danger",
        });
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
        <Row>
          <Col col={6}>
            <FormGroup mb="20px">
              <TextArea
                id="languagename"
                label="Translation key"
                placeholder="For Multiple (ABC,BCD) use comma seperate"
                hint="For Multiple (ABC,BCD) use comma seperate" // for bottom hint
                className="form-control"
                {...register("lang_key", {
                  required: "Language name is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <TextArea
                id="language_code"
                type="text"
                label="Translation value"
                placeholder="For Multiple (ABC,BCD) use comma seperate"
                hint="For Multiple (ABC,BCD) use comma seperate" // for bottom hint
                className="form-control"
                {...register("lang_value", {
                  required: "Language short code is required",
                })}
              />
            </FormGroup>
          </Col>
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
