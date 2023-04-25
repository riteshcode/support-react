import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormGroup,
  Row,
  Col,
  Input,
  Label,
} from "component/UIElement/UIElement";
import { useSelector } from "react-redux";
import { ErrorMessage } from "@hookform/error-message";
import { Trans } from "lang";
import { Card } from "react-bootstrap";

function MultipleAddress({ country }) {
  const { language } = useSelector((state) => state.login);
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mulAddress",
  });

  return (
    <>
      <Row>
        <Col col={12} className="text-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              append({
                address_id: "",
                address_type: "",
                street_address: "",
                city: "",
                state: "",
                zipcode: "",
                countries_id: "",
                phone: "",
              });
            }}
          >
            {Trans("ADD_ADDRESS", language)}
          </button>
        </Col>
      </Row>
      <br />
      {fields.map((item, index) => {
        return (
          <Card className="mb-2" key={index}>
            <Card.Header as="h6">
              {Trans("FILL_ADDRESS", language)}
              {index !== 0 && (
                <button
                  type="button"
                  style={{ float: "right" }}
                  className="btn btn-danger"
                  onClick={() => remove(index)}
                >
                  X
                </button>
              )}
            </Card.Header>
            <Card.Body>
              <Row key={item.id}>
                <Col col={4}>
                  <input
                    type="hidden"
                    {...register(`mulAddress.${index}.address_id`)}
                  />
                  <FormGroup mb="20px">
                    <label>
                      <b>{Trans("ADDRESS_TYPE", language)}</b>
                    </label>
                    <select
                      id="ADDRESS_TYPE"
                      label={Trans("ADDRESS_TYPE", language)}
                      placeholder={Trans("ADDRESS_TYPE", language)}
                      className="form-control"
                      {...register(`mulAddress.${index}.address_type`, {
                        required: Trans("ADDRESS_TYPE_REQUIRED", language),
                      })}
                    >
                      <option value="">{Trans("SELECT_ADDRESS_TYPE")}</option>
                      <option value={1}>{Trans("BOTH")}</option>
                      <option value={2}>{Trans("BILLING")}</option>
                      <option value={3}>{Trans("SHIPPING")}</option>
                    </select>
                    <span className="required">
                      <ErrorMessage
                        errors={errors}
                        name={`mulAddress.${index}.address_type`}
                      />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="STREET_ADDRESS"
                      label={Trans("STREET_ADDRESS", language)}
                      placeholder={Trans("STREET_ADDRESS", language)}
                      className="form-control"
                      {...register(`mulAddress.${index}.street_address`, {
                        required: Trans("STREET_ADDRESS_REQUIRED", language),
                      })}
                    />
                    <span className="required">
                      <ErrorMessage
                        errors={errors}
                        name={`mulAddress.${index}.street_address`}
                      />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={4}>
                  <FormGroup mb="20px">
                    <Input
                      id="CITY"
                      label={Trans("CITY", language)}
                      placeholder={Trans("CITY", language)}
                      className="form-control"
                      {...register(`mulAddress.${index}.city`, {
                        required: Trans("CITY_REQUIRED", language),
                      })}
                    />
                    <span className="required">
                      <ErrorMessage
                        errors={errors}
                        name={`mulAddress.${index}.city`}
                      />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={3}>
                  <FormGroup mb="20px">
                    <Input
                      id="STATE"
                      label={Trans("STATE", language)}
                      placeholder={Trans("STATE", language)}
                      className="form-control"
                      {...register(`mulAddress.${index}.state`, {
                        required: Trans("STATE_REQUIRED", language),
                      })}
                    />
                    <span className="required">
                      <ErrorMessage
                        errors={errors}
                        name={`mulAddress.${index}.state`}
                      />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={3}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("COUNTRY", language)}
                    >
                      {Trans("COUNTRY", language)}
                    </Label>
                    <select
                      id={Trans("COUNTRY", language)}
                      placeholder={Trans("COUNTRY", language)}
                      className="form-control"
                      {...register(`mulAddress.${index}.countries_id`, {
                        required: Trans("COUNTRY_REQUIRED", language),
                      })}
                    >
                      <option value="">
                        {Trans("SELECT_COUNTRY", language)}
                      </option>
                      {country &&
                        country.map((curr) => (
                          <option
                            value={curr.countries_id}
                            key={curr.countries_id}
                          >
                            {curr.countries_name}
                          </option>
                        ))}
                    </select>

                    <span className="required">
                      <ErrorMessage
                        errors={errors}
                        name={`mulAddress.${index}.countries_id`}
                      />
                    </span>
                  </FormGroup>
                </Col>

                <Col col={3}>
                  <FormGroup mb="20px">
                    <Input
                      id="ZIPCODE"
                      label={Trans("ZIPCODE", language)}
                      placeholder={Trans("ZIPCODE", language)}
                      className="form-control"
                      {...register(`mulAddress.${index}.zipcode`, {
                        required: Trans("ZIPCODE_REQUIRED", language),
                      })}
                      type="number"
                    />
                    <span className="required">
                      <ErrorMessage
                        errors={errors}
                        name={`mulAddress.${index}.zipcode`}
                      />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={3}>
                  <FormGroup mb="20px">
                    <Input
                      id="PHONE"
                      label={Trans("PHONE", language)}
                      placeholder={Trans("PHONE", language)}
                      className="form-control"
                      {...register(`mulAddress.${index}.phone`, {
                        required: Trans("PHONE_REQUIRED", language),
                      })}
                      type="number"
                    />
                    <span className="required">
                      <ErrorMessage
                        errors={errors}
                        name={`mulAddress.${index}.phone`}
                      />
                    </span>
                  </FormGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
}
export default MultipleAddress;
