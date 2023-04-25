import React, { useState, useEffect } from "react";
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

function MultipleItem({ product, editItem, totalItemCost }) {
  const { language } = useSelector((state) => state.login);
  const {
    register,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useFormContext();

  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: "Item",
  });

  const handleMultiSelectChange = (newValue, actionMeta) => {
    console.log("newValue", newValue);
    console.log("actionMeta", actionMeta);
    if (actionMeta.action === "select-option")
      append({
        item_name: actionMeta.option.label,
        quantity: "",
        unit_price: "",
        discount: "",
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

  useEffect(() => {
    let abortController = new AbortController();

    function appendDynamic() {
      if (editItem.length === 0) {
        replace([
          // {
          //   item_name: "",
          //   quantity: "",
          //   unit_price: "",
          //   discount: "",
          //   item_cost: "",
          // },
        ]);
      } else {
        for (let index = 0; index < editItem.length; index++) {
          editItem[index].id = Math.floor(Math.random() * 100) + 1;
          append(editItem[index]);
        }
      }
    }
    appendDynamic();

    return () => abortController.abort();
  }, [editItem]);

  console.log("fields", fields);
  return (
    <>
      <Card>
        <Card.Header as="h6">
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
                    item_name: "",
                    quantity: "",
                    unit_price: "",
                    discount: "",
                    item_cost: "",
                  });
                }}
                style={{ width: "86%", float: "right" }}
              >
                {Trans("ADD_ITEM", language)}
              </button>
            </Col>
          </Row>
        </Card.Header>
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
                          // label={Trans("ITEM_NAME", language)}
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
      </Card>
    </>
  );
}
export default MultipleItem;
