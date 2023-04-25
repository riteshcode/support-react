import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { LoaderButton, FormGroup, Label } from "component/UIElement/UIElement";
import { Trans } from "lang";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import POST from "axios/post";
import { staffChangeStatusUrl } from "config";
import Notify from "component/Notify";
import { useEffect } from "react";

function TerminationModal({ ModalObject }) {
  const { language, apiToken } = useSelector((state) => state.login);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit } = useForm();

  console.log("ModalObject", ModalObject);
  const { functionName, type, status, closeModal, param } = ModalObject;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);

    formData.api_token = apiToken;
    formData.staff_id = param;
    formData.type = type;

    POST(staffChangeStatusUrl, formData)
      .then((response) => {
        const { message } = response.data;
        functionName("refresh", "", "");
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
  }, [ModalObject]);

  return (
    <>
      <Modal size="sm" show={true} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>
            {status === 1
              ? Trans("TERMINATION", language)
              : Trans("STATUS_HEADING", language)}
          </Modal.Title>
          <Button variant="danger" onClick={closeModal}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
            {status === 1 && (
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
            )}
            <LoaderButton
              formLoadStatus={formloadingStatus}
              btnName={Trans(status === 1 ? "SUBMIT" : "YES", language)}
              className="btn btn-primary"
            />
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TerminationModal;
