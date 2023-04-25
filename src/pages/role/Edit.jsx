import React, { useState } from "react";
import { LoaderButton, FormGroup, Label } from "component/UIElement/UIElement";
import EditPermissionUI from "./EditPermissionUI";
import { Trans } from "lang";
import { useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import POST from "axios/post";
import { updateRoleUrl, editRoleUrl } from "config";
import Alert from "component/UIElement/Alert";
import Notify from "component/Notify";
import { useEffect } from "react";

function Edit(props) {
  console.log("Edit propps", props);
  const { editId } = props;

  const { language, apiToken } = useSelector((state) => state.login);
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const methods = useForm();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [msgType, setMsgType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editPermission, SetEditPermission] = useState();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(updateRoleUrl, saveFormData)
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
  };

  const editRole = (roleID) => {
    const editData = {
      api_token: apiToken,
      updateId: roleID,
    };
    POST(editRoleUrl, editData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          setValue("updatedId", data.roles_id);
          setValue("role_name", data.roles_name);
          SetEditPermission(data.permissions_type_list);
        } else {
          Notify(true, Trans(message, language));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    editRole(editId);
    return () => {
      editRole(editId);
    };
  }, []);

  return (
    <React.Fragment>
      {msgType.length > 2 &&
        (msgType === "success" ? (
          <Alert type="success">{errorMsg}</Alert>
        ) : (
          <Alert type="danger">{errorMsg}</Alert>
        ))}
      <FormProvider {...methods}>
        <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
          <input {...register("updatedId")} type="hidden" />
          <FormGroup mb="20px">
            <Label display="block" mb="5px" htmlFor="name">
              <b>{Trans("NAME", language)}</b>
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
            <EditPermissionUI
              Compname="permissionList"
              checkedPermission={editPermission}
            />
          </FormGroup>

          <LoaderButton
            formLoadStatus={formloadingStatus}
            btnName={Trans("UPDATE", language)}
            className="btn btn-primary btn-block"
          />
        </form>
      </FormProvider>
    </React.Fragment>
  );
}

export default Edit;
