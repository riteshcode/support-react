import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { Card, Button } from "react-bootstrap";
import { useFieldArray } from "react-hook-form";
import { Trans } from "lang";
import { Row, Col, FormGroup, Label } from "component/UIElement/UIElement";
import FeatherIcon from "feather-icons-react";
import { ErrorMessage } from "@hookform/error-message";

function ProductAttribute({ productAttribute }) {
  const { language } = useSelector((state) => state.login);

  const methods = useFormContext();

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const productAttributeFields = useFieldArray({
    control,
    name: "productAttribute",
  });

  const ModuleChange = (e, suboption_id) => {
    let value = e.target.value;
    if (value === "") return "";

    const sectionlistData = JSON.parse(
      e.target.selectedOptions[0].attributes[1].nodeValue
    );
    //   console.log(sectionlistData);
    let optionValue = "";

    if (sectionlistData.length > 0) {
      for (let index = 0; index < sectionlistData.length; index++) {
        optionValue += `
                        <option
                        key=${sectionlistData[index]["products_options_values_id"]}
                        value=${sectionlistData[index]["products_options_values_id"]}
                        >
                        ${sectionlistData[index]["products_options_values_name"]}
                        </option>
                    `;
      }
    }
    document.getElementById(suboption_id).innerHTML = optionValue;
  };

  return (
    <Col col={12}>
      <Card className="mb-3">
        <Card.Header as="h6">
          {Trans("PRODUCT_OPTION_ATTRIBUTES", language)}
          <span style={{ float: "right" }}>
            <button
              type="button"
              className="btn btn-xs btn-info"
              onClick={() => {
                productAttributeFields.prepend({});
              }}
            >
              <FeatherIcon icon="plus" fill="white" />
              {Trans("ADD_MORE_OPTION", language)}
            </button>
          </span>
        </Card.Header>
        <Card.Body>
          {productAttribute &&
            productAttribute.map((attribute_op) => {
              return (
                <Row>
                  <Col col={12}>
                    <Label display="block" mb="5px">
                      {/* <input type="checkbox" name="" id="" /> */}
                      {attribute_op.products_options_name}
                    </Label>
                  </Col>

                  <Col col={12}>
                    <Row>
                      {attribute_op.products_options_values.map((optionval) => {
                        return (
                          <Col col={2}>
                            <input
                              type="checkbox"
                              name=""
                              id=""
                              defaultChecked={true}
                            />
                            <label htmlFor="">
                              {optionval.products_options_values_name}
                            </label>
                            <input
                              {...register(
                                `productAttribute.options_values_price`
                              )}
                              className="form-control"
                              id={`productAttribute.options_values_price`}
                              placeholder={Trans("PRICE", language)}
                            />
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                  <option
                    key={attribute_op.products_options_id}
                    value={attribute_op.products_options_id}
                    attributes={JSON.stringify()}
                  ></option>
                </Row>
              );
            })}

          {productAttributeFields.fields.map((item, index) => {
            return (
              <Row key={item.id}>
                <Col col={4}>
                  <FormGroup>
                    <select
                      id={`productAttribute.${index}.options_id`}
                      className="form-control"
                      {...register(`productAttribute.${index}.options_id`, {
                        required: Trans("REQUIRED", language),
                      })}
                      onChange={(e) => {
                        ModuleChange(
                          e,
                          `productAttribute.${index}.options_values_id`
                        );
                      }}
                    >
                      <option value="">
                        {Trans("SELECT_ATTRIBUTE_OPTION", language)}
                      </option>
                      {productAttribute &&
                        productAttribute.map((attribute_op) => {
                          return (
                            <option
                              key={attribute_op.products_options_id}
                              value={attribute_op.products_options_id}
                              attributes={JSON.stringify(
                                attribute_op.products_options_values
                              )}
                            >
                              {attribute_op.products_options_name}
                            </option>
                          );
                        })}
                    </select>
                    <span className="required">
                      <ErrorMessage
                        errors={errors}
                        name={`productAttribute.${index}.options_id`}
                      />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={12}>
                  <Row>
                    <Col col={2}>
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        defaultChecked={true}
                      />
                      <label htmlFor="">test</label>
                      <input
                        {...register(
                          `productAttribute.${index}.options_values_price`
                        )}
                        className="form-control"
                        id={`productAttribute.${index}.options_values_price`}
                        placeholder={Trans("PRICE", language)}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col col={4}>
                  <FormGroup>
                    <select
                      id={`productAttribute.${index}.options_values_id`}
                      className="form-control"
                      {...register(
                        `productAttribute.${index}.options_values_id`,
                        {
                          required: Trans("REQUIRED", language),
                        }
                      )}
                    >
                      <option value="">
                        {Trans("SELECT_OPTION_VALUES", language)}
                      </option>
                    </select>
                    <span className="required">
                      <ErrorMessage
                        errors={errors}
                        name={`productAttribute.${index}.options_values_id`}
                      />
                    </span>
                  </FormGroup>
                </Col>
                <Col col={3}>
                  <FormGroup>
                    <input
                      {...register(
                        `productAttribute.${index}.options_values_price`
                      )}
                      className="form-control"
                      id={`productAttribute.${index}.options_values_price`}
                      placeholder={Trans("ATTRIBUTE_OPTION_PRICE", language)}
                    />
                  </FormGroup>
                </Col>
                <Col col={1}>
                  <span style={{ lineHeight: "42px" }}>
                    <FeatherIcon
                      icon="x-square"
                      color="red"
                      onClick={() => productAttributeFields.remove(index)}
                      size={20}
                    />
                  </span>
                </Col>
              </Row>
            );
          })}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ProductAttribute;
