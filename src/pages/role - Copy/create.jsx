import React, { useState } from "react";
import { LoaderButton, FormGroup, Label } from "component/UIElement/UIElement";
import PermissionCheckbox from "component/PermissionCheckbox";
import { Trans } from "lang";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import POST from "axios/post";
import { createRoleUrl } from "config";
import Alert from "component/UIElement/Alert";
import Notify from "component/Notify";

function Create(props) {
  const { language, apiToken } = useSelector((state) => state.login);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [msgType, setMsgType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = (formData) => {
    console.log("formData", formData);
    SetformloadingStatus(true);

    const checkedList = document.querySelectorAll(
      'input[name="permissionList"]:checked'
    );

    if (checkedList.length === 0) {
      setMsgType("error");
      setErrorMsg(Trans("PLEASE_CHECK_PERMISSION", language));
      SetformloadingStatus(false);
    } else {
      const permissionArr = [];
      for (let i = 0; i < checkedList.length; i += 1) {
        if (checkedList[i].value !== "")
          permissionArr.push(checkedList[i].value);
      }
      const saveFormData = formData;
      saveFormData.api_token = apiToken;
      saveFormData.permission_name = permissionArr;

      POST(createRoleUrl, saveFormData)
        .then((response) => {
          const { status, message } = response.data;
          if (status) {
            props.filterItem("refresh", "", "");
            props.handleModalClose();
            setMsgType("success");
            setErrorMsg(Trans(message, language));
            Notify(true, Trans(message, language));
          } else {
            setMsgType("danger");
            if (typeof message === "object") {
              let errMsg = "";
              Object.keys(message).map((key) => {
                errMsg += Trans(message[key][0], language);
                return errMsg;
              });
              setErrorMsg(errMsg);
            } else {
              setErrorMsg(Trans(message, language));
            }
          }
          SetformloadingStatus(false);
        })
        .catch((error) => {
          Notify(false, error.message);
          console.log(error);
          setMsgType("danger");
          setErrorMsg("Something went wrong !");
          SetformloadingStatus(false);
        });
    }
  };

  return (
    <>
      {msgType.length > 2 &&
        (msgType === "success" ? (
          <Alert type="success">{errorMsg}</Alert>
        ) : (
          <Alert type="danger">{errorMsg}</Alert>
        ))}

      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormGroup mb="20px">
          <Label display="block" mb="5px" htmlFor="name">
            <b>{Trans("NAME", language)}:</b>
          </Label>
          <input
            id="name"
            type="text"
            className="form-control"
            placeholder="Enter your name"
            {...register("role_name", {
              required: "Role Name is required",
            })}
          />
          {errors.role_name && <span>This field is required</span>}
        </FormGroup>
        <FormGroup mb="20px">
          <Label display="block" mb="5px" htmlFor="permissionList">
            <b>{Trans("PERMISSION", language)}:</b>
          </Label>
          <PermissionCheckbox Compname="permissionList" />
        </FormGroup>
        <LoaderButton
          formLoadStatus={formloadingStatus}
          btnName={Trans("CREATE", language)}
          className="btn btn-primary btn-block"
        />
      </form>
    </>
  );
}

export default Create;
