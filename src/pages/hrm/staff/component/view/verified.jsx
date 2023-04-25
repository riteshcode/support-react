import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { LoaderButton, FormGroup, Label } from "component/UIElement/UIElement";
import { Trans } from "lang";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import POST from "axios/post";
import { staffVerifiedUrl } from "config";
import Notify from "component/Notify";
import { useEffect } from "react";

function Verified({ handleModalClose, staffId }) {
  const { language, apiToken } = useSelector((state) => state.login);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);

    formData.api_token = apiToken;

    POST(staffVerifiedUrl, formData)
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

export default Verified;
