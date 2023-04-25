import React, { useState } from "react";
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
import Select from "react-select";

function MultipleItem({ proAttr, product, totalItemCost }) {
  const { language } = useSelector((state) => state.login);
  const {
    register,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Item",
  });

  const handleMultiSelectChange = (newValue, actionMeta) => {
    console.log("newValue", newValue);
    console.log("actionMeta", actionMeta);
    console.log("proAttr", proAttr);
    let exp = actionMeta.option.value.split(":");
    console.log("exp", exp);
    console.log("proAttr[exp[0]]", proAttr[exp[0]]);
    if (actionMeta.action === "select-option")
      append({
        item_id: exp[0],
        item_name: actionMeta.option.label,
        quantity: "",
        item_attr: true,
        item_attr_list: proAttr[exp[0]],
        item_attr_sel_list: [],
        unit_price: exp[1],
        discount: "0",
        item_cost: "",
      });

    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
  };

  const item_cost_calc = (index, type, price) => {
    let qty = getValues(`Item.${index}.quantity`);
    let unit_price = getValues(`Item.${index}.unit_price`);
    let discount = getValues(`Item.${index}.discount`);

    if (qty === "") qty = 0;
    if (unit_price === "") unit_price = 0;
    if (discount === "") discount = 0;

    let unit_cost = parseFloat(
      parseInt(qty) * parseFloat(unit_price) - parseFloat(discount)
    ).toFixed(2);
    setValue(`Item.${index}.item_cost`, unit_cost);
    totalItemCost();
  };

  return (
    <>
      <Card>
        <Card.Header>
          <Row>
            <Col col={3} className="text-left">
              <b style={{ fontSize: "1rem", lineHeight: "38px" }}>
                {Trans("ITEM_LIST", language)}
              </b>

              <span
                style={{ fontSize: "1rem", lineHeight: "38px", float: "right" }}
              >
                SELECT_ITEM
              </span>
            </Col>
            <Col col={6}>
              <Select
                isMulti
                name={Trans("PRODUCT", language)}
                options={product}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleMultiSelectChange}
                placeholder="Choose Item..."
              />
            </Col>
            <Col col={3}>
              <span style={{ fontSize: "1rem", lineHeight: "38px" }}>OR</span>
              <button
                type="button"
                className="btn btn-info form-control"
                onClick={() => {
                  append({
                    item_id: 0,
                    item_name: "",
                    item_attr: false,
                    item_attr_list: [],
                    item_attr_sel_list: [],
                    quantity: "",
                    unit_price: "",
                    discount: "0",
                    item_cost: "",
                  });
                }}
                style={{ width: "86%", float: "right", color: "white" }}
              >
                {Trans("ADD_CUSTOM_ITEM", language)}
              </button>
            </Col>
          </Row>
        </Card.Header>
        {fields.length > 0 && (
          <Card.Body>
            {fields.map((item, index) => {
              return (
                <Card className="mb-2" key={index}>
                  <Card.Body>
                    <Row key={item.id}>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <input
                            id="ITEM_NAME"
                            placeholder={Trans("ITEM_NAME", language)}
                            className="form-control"
                            {...register(`Item.${index}.item_name`, {
                              required: Trans("ITEM_NAME_REQUIRED", language),
                            })}
                          />
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name={`Item.${index}.item_name`}
                            />
                          </span>
                          {getValues(`Item.${index}.item_attr`) && (
                            <React.Fragment>
                              {getValues(`Item.${index}.item_attr_list`) &&
                                getValues(`Item.${index}.item_attr_list`).map(
                                  (group, idx) => {
                                    return (
                                      <React.Fragment key={idx}>
                                        <select
                                          {...register(
                                            `Item.${index}.item_attr_sel_list.${idx}`,
                                            {
                                              required: Trans(
                                                "REQUIRED",
                                                language
                                              ),
                                            }
                                          )}
                                        >
                                          <option value="">
                                            {group?.option_name}
                                          </option>
                                          {group.option_value_list &&
                                            group.option_value_list.map(
                                              (optionValue, valKey) => {
                                                return (
                                                  <React.Fragment key={valKey}>
                                                    <option
                                                      value={
                                                        optionValue
                                                          ?.product_options_value
                                                          ?.products_options_values_id
                                                      }
                                                    >
                                                      {
                                                        optionValue
                                                          ?.product_options_value
                                                          ?.products_options_values_name
                                                      }
                                                    </option>
                                                  </React.Fragment>
                                                );
                                              }
                                            )}{" "}
                                        </select>
                                        <span className="required">
                                          <ErrorMessage
                                            errors={errors}
                                            name={`Item.${index}.item_attr_sel_list.${idx}`}
                                          />
                                        </span>
                                      </React.Fragment>
                                    );
                                  }
                                )}
                            </React.Fragment>
                          )}
                        </FormGroup>
                      </Col>
                      <Col col={2}>
                        <FormGroup mb="20px">
                          <input
                            id="QUANTITY"
                            // label={Trans("QUANTITY", language)}
                            placeholder={Trans("QUANTITY", language)}
                            className="form-control"
                            {...register(`Item.${index}.quantity`, {
                              required: Trans("QUANTITY_REQUIRED", language),
                            })}
                            type="number"
                            onKeyUp={(e) => {
                              item_cost_calc(index, "qty", e.target.value);
                            }}
                          />
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name={`Item.${index}.quantity`}
                            />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={2}>
                        <FormGroup mb="20px">
                          <input
                            id="UNIT_PRICE"
                            // label={Trans("UNIT_PRICE", language)}
                            placeholder={Trans("UNIT_PRICE", language)}
                            className="form-control"
                            {...register(`Item.${index}.unit_price`, {
                              required: Trans("UNIT_PRICE_REQUIRED", language),
                            })}
                            type="number"
                            onKeyUp={(e) => {
                              item_cost_calc(index, "qty", e.target.value);
                            }}
                          />
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name={`Item.${index}.unit_price`}
                            />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={2}>
                        <FormGroup mb="20px">
                          <input
                            id="DISCOUNT"
                            // label={Trans("DISCOUNT", language)}
                            placeholder={Trans("DISCOUNT", language)}
                            className="form-control"
                            {...register(`Item.${index}.discount`)}
                            type="number"
                            defaultValue={0}
                            onKeyUp={(e) => {
                              item_cost_calc(index, "qty", e.target.value);
                            }}
                          />
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name={`Item.${index}.discount`}
                            />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <input
                            id="ITEM_COST"
                            // label={Trans("ITEM_COST", language)}
                            placeholder={Trans("ITEM_COST", language)}
                            className="form-control"
                            {...register(`Item.${index}.item_cost`, {
                              required: Trans("ITEM_COST_REQUIRED", language),
                            })}
                            readOnly
                          />
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name={`Item.${index}.item_cost`}
                            />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={1}>
                        <button
                          type="button"
                          className="btn btn-danger form-control"
                          onClick={() => remove(index)}
                        >
                          X
                        </button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })}
          </Card.Body>
        )}
      </Card>
    </>
  );
}
export default MultipleItem;
