import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  LoaderButton,
  FormGroup,
  Label,
  Input,
} from "component/UIElement/UIElement";
import { Trans } from "lang";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import POST from "axios/post";
import { staffTerminateUrl } from "config";
import Notify from "component/Notify";
import { useEffect } from "react";

function Terminate({ handleModalClose, staffId }) {
  const { language, apiToken } = useSelector((state) => state.login);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);

    formData.api_token = apiToken;

    POST(staffTerminateUrl, formData)
      .then((response) => {
        const { message } = response.data;
        Notify(true, Trans(message, language));
        SetformloadingStatus(false);
      })
      .catch((error) => {
        SetformloadingStatus(false);
        Notify(false, error.message);
      });
  };

  useEffect(() => {
    let abortController = new AbortController();

    return () => abortController.abort();
  });

  return (
    <>
      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="hidden" {...register("staff_id")} defaultValue={staffId} />
        <>
          <FormGroup mb="20px">
            <Label display="block" mb="5px">
              {Trans("TERMINATION_REASON", language)}
            </Label>
            <select
              {...register("termination_reason", {
                required: Trans("SELECT_TERMINATION_REASON", language),
              })}
              className="form-control"
            >
              <option value="">
                {Trans("SELECT_TERMINATION_REASON", language)}
              </option>
              <option value={1}>{Trans("LEFT", language)}</option>
              <option value={2}>{Trans("RESIGNED", language)}</option>
              <option value={3}>{Trans("FIRED", language)}</option>
              <option value={4}>{Trans("OTHERS", language)}</option>
            </select>
          </FormGroup>
          <FormGroup mb="20px">
            <Input
              id="DATE_OF_LEAVING"
              type="date"
              label={Trans("DATE_OF_LEAVING", language)}
              placeholder="Enter.."
              hint="Enter text" // for bottom hint
              className="form-control"
              {...register("date_of_leaving", {
                required: "DATE_OF_LEAVING_IS_REQUIRED",
              })}
            />
          </FormGroup>
          <FormGroup mb="20px">
            <Label display="block" mb="5px">
              {Trans("REMARK_DETAILS", language)}
            </Label>
            <textarea
              type="text"
              className="form-control"
              placeholder={Trans("REMARK_DETAILS", language)}
              {...register("remark_details", {
                required: Trans("REMARK_DETAILS", language),
              })}
            ></textarea>
          </FormGroup>

          <FormGroup>
            <Label display="block" mb="5px" htmlFor={Trans("REHIRE", language)}>
              {Trans("REHIRE", language)} <span className="required">*</span>
            </Label>
            <input
              style={{ marginLeft: 10 }}
              id={Trans("REHIRE", language)}
              type="checkbox"
              placeholder={Trans("REHIRE", language)}
              {...register("rehire")}
            />
          </FormGroup>
        </>

        <LoaderButton
          formLoadStatus={formloadingStatus}
          btnName={Trans("SUBMIT", language)}
          className="btn btn-primary"
        />
      </form>
    </>
  );
}

export default Terminate;
