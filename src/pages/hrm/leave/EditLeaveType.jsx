import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { leaveTypeUpdateUrl } from "config/index";
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
import Notify from "component/Notify";

const EditLeaveType = (props) => {
  console.log(props);
  const { editData } = props;
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const { apiToken, language } = useSelector((state) => state.login);
  // const [error, setError] = useState({
  //   status: false,
  //   msg: "",
  //   type: "",
  // });

  setValue("updateId", editData.leave_type_id);
  setValue("info", editData.info);
  setValue("name", editData.name);
  setValue("max_allowed", editData.max_allowed);
  setValue("no_of_days", editData.no_of_days);

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(leaveTypeUpdateUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          props.handleModalClose();
          props.getList();
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
              errMsg += Trans(message[key][0], language);
              return errMsg;
            });
            errObj.msg = errMsg;
          } else {
            errObj.msg = message;
          }
          Notify(true, Trans(errObj.msg, language));
        }
      })
      .catch((error) => {
        console.log(error);
        Notify(true, Trans(error.message, language));
      });
  };

  return (
    <>
      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="hidden" {...register("updateId")} />
        <Row>
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id="Leave Type"
                label={Trans("Leave Type", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("leave_type_name", {
                  required: "name is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="no_of_days"
                type="number"
                label={Trans("no_of_days", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("no_of_days", {
                  required: "no_of_days is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="max_allowed"
                type="number"
                label={Trans("max_allowed", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("max_allowed")}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <TextArea
                id="Description"
                label={Trans("Information", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("leave_info", {
                  required: "REASON_REQUIRED",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <LoaderButton
              formLoadStatus={formloadingStatus}
              btnName={Trans("SUBMIT", language)}
              className="btn btn-primary btn-block"
            />
          </Col>
        </Row>
      </form>
    </>
  );
};

export default EditLeaveType;
