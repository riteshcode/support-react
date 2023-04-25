import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { leaveStoreUrl, leaveTypeUrl } from "config/index";
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

const LeaveApplication = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(leaveStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          props.filterItem("refresh", "", "");
          props.handleModalClose();
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

  const [leaveInfo, setLeaveInfo] = useState([]);
  const getList = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(leaveTypeUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          setLeaveInfo(data);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    getList();
  }, []);
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
          <Col col={12}>
            <FormGroup mb="20px">
              <Input
                id="SORT"
                label={Trans("SUBJECT", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("subject", {
                  required: "Subject is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="FROM"
                type="date"
                label={Trans("FROM", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("from_date", {
                  required: "From date is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="TO"
                type="date"
                label={Trans("TO", language)}
                placeholder="Enter.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("to_date", {
                  required: "To date is required",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <TextArea
                id="Description"
                label={Trans("REASON", language)}
                placeholder="Enter description.."
                hint="Enter text" // for bottom hint
                className="form-control"
                {...register("reason", {
                  required: "REASON_REQUIRED",
                })}
              />
            </FormGroup>
          </Col>
          <Col col={12}>
            <FormGroup mb="20px">
              <label htmlFor="">{Trans("LEAVE_TYPE", language)}</label>
              <select {...register("leave_type_id", {
                  required: "LEAVE is required",
                })} id="" className="form-control">
                <option value="">Select {Trans("LEAVE_TYPE", language)}</option>
                {leaveInfo &&
                  leaveInfo.map((leave, idx) => {
                    return (
                      <option key={idx} value={leave.leave_type_id}>
                        {leave.name} ({leave.no_of_days}){" "}
                      </option>
                    );
                  })}
              </select>
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

export default LeaveApplication;
