import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { Card, Button } from "react-bootstrap";
import { useFieldArray } from "react-hook-form";
import { Trans } from "lang";
import { Row, Col, FormGroup, Label } from "component/UIElement/UIElement";
import FeatherIcon from "feather-icons-react";
import { ErrorMessage } from "@hookform/error-message";

function ProductAttribute({ editProductAttribute, productAttribute }) {
  const { language } = useSelector((state) => state.login);

  const methods = useFormContext();

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const productAttributeFields = useFieldArray({
    control,
    name: "productAttribute",
  });

  const [productTypeFields, SetProductTypeFields] = useState("");
  const ModuleChange = (e, suboption_id) => {
    let value = e.target.value;
    if (value !== undefined || value !== "") {
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
      console.log(optionValue);

      document.getElementById(suboption_id).innerHTML = optionValue;

      //   SetProductTypeFields(JSON.parse(sectionlistData));
    }
  };

  console.log("productAttributeFields", productAttributeFields);
  console.log("productAttribute", productAttribute);
  // console.log("editProductAttribute", editProductAttribute);

  // console.log("editProductAttribute", editProductAttribute);

  return (
    <Col col={12}>
      <Card className="mb-3">
        <Card.Header as="h6">
          Product Attributes
          <span style={{ float: "right" }}>
            <button
              type="button"
              className="btn btn-xs btn-info"
              onClick={() => {
                productAttributeFields.prepend({});
              }}
            >
              <FeatherIcon icon="plus" fill="white" />
              Add Options
            </button>
          </span>
        </Card.Header>
        <Card.Body>
          {productAttributeFields.fields.map((item, index) => {
            // console.log("editProductAttribute[index]", editProductAttribute);
            return (
              <Row key={item.id}>
                <Col col={12}>
                  <div
                    id="accordion4"
                    className="accordion accordion-style2 ui-accordion ui-widget ui-helper-reset "
                  >
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                      <h6
                        style={{ height: "40px" }}
                        className="accordion-title ui-accordion-header ui-corner-top ui-state-default ui-accordion-header-active ui-state-active ui-accordion-icons h6Module"
                      >
                        <span style={{ float: "right" }}>
                          <FeatherIcon
                            icon="x-square"
                            color="red"
                            onClick={() => productAttributeFields.remove(index)}
                            size={20}
                          />
                        </span>
                      </h6>
                      <div className="accordion-body ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content ui-accordion-content h6bodyIn">
                        <div className="row">
                          <Col col={4}>
                            <FormGroup>
                              <Label
                                display="block"
                                mb="5px"
                                htmlFor={`productAttribute.${index}.options_id`}
                              >
                                {Trans("OPTION", language)}
                              </Label>
                              {productAttribute && (
                                <React.Fragment>
                                  <select
                                    id={`productAttribute.${index}.options_id`}
                                    className="form-control"
                                    {...register(
                                      `productAttribute.${index}.options_id`,
                                      {
                                        required: Trans("REQUIRED", language),
                                      }
                                    )}
                                    onChange={(e) => {
                                      ModuleChange(
                                        e,
                                        `productAttribute.${index}.options_values_id`
                                      );
                                    }}
                                    value={
                                      editProductAttribute === undefined
                                        ? 0
                                        : editProductAttribute.options_id
                                    }
                                  >
                                    <option value="">
                                      {Trans(
                                        "SELECT_ATTRIBUTE_OPTION",
                                        language
                                      )}
                                    </option>
                                    {productAttribute.map(
                                      (attribute_op, ix) => {
                                        return (
                                          <option
                                            key={ix}
                                            value={
                                              attribute_op.products_options_id
                                            }
                                            attributes={JSON.stringify(
                                              attribute_op.products_options_values
                                            )}
                                          >
                                            {attribute_op.products_options_name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </React.Fragment>
                              )}
                              <span className="required">
                                <ErrorMessage
                                  errors={errors}
                                  name={`productAttribute.${index}.options_id`}
                                />
                              </span>
                            </FormGroup>
                          </Col>
                          <Col col={4}>
                            <FormGroup>
                              <Label
                                display="block"
                                mb="5px"
                                htmlFor={`productAttribute.${index}.options_values_id`}
                              >
                                {Trans("OPTION_VALUE", language)}
                              </Label>
                              {editProductAttribute &&
                                editProductAttribute[index] && (
                                  <React.Fragment>
                                    <select
                                      id={`productAttribute.${index}.options_values_id`}
                                      className="form-control"
                                      {...register(
                                        `productAttribute.${index}.options_values_id`,
                                        {
                                          required: Trans("REQUIRED", language),
                                        }
                                      )}
                                      test={
                                        editProductAttribute === undefined
                                          ? 0
                                          : editProductAttribute.options_values_id
                                      }
                                      value={
                                        editProductAttribute === undefined
                                          ? 0
                                          : editProductAttribute.options_values_id
                                      }
                                    >
                                      <option value="">
                                        {Trans(
                                          "SELECT_OPTION_VALUES",
                                          language
                                        )}
                                      </option>
                                      {editProductAttribute[index][
                                        "option_value_list"
                                      ].map((attribute_op, idx) => {
                                        return (
                                          <option
                                            key={idx}
                                            value={
                                              attribute_op.products_options_values_id
                                            }
                                          >
                                            {
                                              attribute_op.products_options_values_name
                                            }
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </React.Fragment>
                                )}
                              <span className="required">
                                <ErrorMessage
                                  errors={errors}
                                  name={`productAttribute.${index}.options_values_id`}
                                />
                              </span>
                            </FormGroup>
                          </Col>
                          <Col col={4}>
                            <FormGroup>
                              <Label
                                display="block"
                                mb="5px"
                                htmlFor={`productAttribute.${index}.options_values_price`}
                              >
                                {Trans("PRICE", language)}
                              </Label>
                              <input
                                {...register(
                                  `productAttribute.${index}.options_values_price`
                                )}
                                className="form-control"
                                id={`productAttribute.${index}.options_values_price`}
                                placeholder={Trans(
                                  "ATTRIBUTE_OPTION_PRICE",
                                  language
                                )}
                              />
                            </FormGroup>
                          </Col>
                        </div>
                      </div>
                    </div>
                  </div>
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
