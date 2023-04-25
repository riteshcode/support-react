import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { leaveTypeStoreUrl } from "config/index";
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

const AddLeaveType = (props) => {
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit } = useForm();
  const { apiToken, language } = useSelector((state) => state.login);
  // const [error, setError] = useState({
  //   status: false,
  //   msg: "",
  //   type: "",
  // });

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(leaveTypeStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          // setError({
          //   status: true,
          //   msg: message,
          //   type: "success",
          // });
          //   props.filterItem("refresh", "", "");
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
          // setError(errObj);
        }
      })
      .catch((error) => {
        console.log(error);
        // setError({
        //   status: true,
        //   msg: error.message,
        //   type: "danger",
        // });
      });
  };

  return (
    <>
      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
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

export default AddLeaveType;
