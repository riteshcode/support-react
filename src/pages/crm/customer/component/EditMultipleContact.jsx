import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormGroup, Row, Col, Input } from "component/UIElement/UIElement";
import { useSelector } from "react-redux";
import { ErrorMessage } from "@hookform/error-message";
import { Trans } from "lang";

function EditMultipleContact({ contactEditData }) {
  const { language } = useSelector((state) => state.login);
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  console.log("control", control);

  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: "contactInfo",
  });

  useEffect(() => {
    let abortController = new AbortController();

    function appendDynamic() {
      if (contactEditData.length === 0) {
        replace([
          {
            contact_id: "",
            contact_name: "sd",
            contact_email: "",
          },
        ]);
      } else {
        for (let index = 0; index < contactEditData.length; index++) {
          contactEditData[index].id = Math.floor(Math.random() * 100) + 1;
          append(contactEditData[index]);
        }
      }
    }
    appendDynamic();

    return () => abortController.abort();
  }, [contactEditData]);

  return (
    <>
      <Row>
        <Col col={12} className="text-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              append({
                contact_id: "",
                contact_name: "",
                contact_email: "",
              });
            }}
          >
            {Trans("ADD_CONTACT", language)}
          </button>
        </Col>
      </Row>
      <br />
      {fields.map((item, index) => {
        return (
          <Row key={index}>
            <Col col={5}>
              <FormGroup mb="20px">
                <input
                  type="hidden"
                  {...register(`contactInfo.${index}.contact_id`)}
                />
                <Input
                  id="CUSTOMER_NAME"
                  label={Trans("CUSTOMER_NAME", language)}
                  placeholder={Trans("CUSTOMER_NAME", language)}
                  className="form-control"
                  {...register(`contactInfo.${index}.contact_name`, {
                    required: Trans("CUSTOMER_NAME_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage
                    errors={errors}
                    name={`contactInfo.${index}.contact_name`}
                  />
                </span>
              </FormGroup>
            </Col>
            <Col col={6}>
              <FormGroup mb="20px">
                <Input
                  id="CUSTOMER_EMAIL"
                  label={Trans("CUSTOMER_EMAIL", language)}
                  placeholder={Trans("CUSTOMER_EMAIL", language)}
                  className="form-control"
                  {...register(`contactInfo.${index}.contact_email`, {
                    required: Trans("CUSTOMER_EMAIL_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage
                    errors={errors}
                    name={`contactInfo.${index}.contact_email`}
                  />
                </span>
              </FormGroup>
            </Col>
            <Col col={1}>
              <FormGroup>
                <button
                  type="button"
                  className="btn btn-danger mt-3"
                  onClick={() => remove(index)}
                >
                  X
                </button>
              </FormGroup>
            </Col>
          </Row>
        );
      })}
    </>
  );
}
export default EditMultipleContact;
