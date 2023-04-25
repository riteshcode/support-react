import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormGroup, Row, Col, Input } from "component/UIElement/UIElement";
import { useSelector } from "react-redux";
import { ErrorMessage } from "@hookform/error-message";
import { Trans } from "lang";

function SocialLink() {
  const { language } = useSelector((state) => state.login);
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLink",
  });

  return (
    <>
      <Row>
        <Col col={12} className="text-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              append({ social_type: "", social_link: "" });
            }}
          >
            {Trans("ADD_MORE_SOCIAL", language)}
          </button>
        </Col>
      </Row>
      <br />
      {fields.map((item, index) => {
        return (
          <Row key={item.id}>
            <Col col={5}>
              <FormGroup mb="20px">
                <label>
                  <b>{Trans("SOCIAL_TYPE", language)}</b>
                </label>
                <select
                  id="SOCIAL_TYPE"
                  label={Trans("SOCIAL_TYPE", language)}
                  placeholder={Trans("SOCIAL_TYPE", language)}
                  className="form-control"
                  {...register(`socialLink.${index}.social_type`, {
                    required: Trans("SOCIAL_TYPE_REQUIRED", language),
                  })}
                >
                  <option value="">{Trans("SELECT_SOCIAL_TYPE")}</option>
                  <option value={1}>{Trans("WHATSAPP")}</option>
                  <option value={2}>{Trans("FACEBOOK")}</option>
                  <option value={3}>{Trans("INSTAGRAM")}</option>
                  <option value={4}>{Trans("LINKEDIN")}</option>
                </select>
                <span className="required">
                  <ErrorMessage
                    errors={errors}
                    name={`socialLink.${index}.social_type`}
                  />
                </span>
              </FormGroup>
            </Col>
            <Col col={6}>
              <FormGroup mb="20px">
                <Input
                  id="SOCIAL_LINK"
                  label={Trans("SOCIAL_LINK", language)}
                  placeholder={Trans("SOCIAL_LINK", language)}
                  className="form-control"
                  {...register(`socialLink.${index}.social_link`, {
                    required: Trans("SOCIAL_LINK_REQUIRED", language),
                  })}
                />
                <span className="required">
                  <ErrorMessage
                    errors={errors}
                    name={`socialLink.${index}.social_link`}
                  />
                </span>
              </FormGroup>
            </Col>
            <Col col={1}>
              <FormGroup mb="20px">
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger form-control mt-3"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                )}
              </FormGroup>
            </Col>
          </Row>
        );
      })}
    </>
  );
}
export default SocialLink;
