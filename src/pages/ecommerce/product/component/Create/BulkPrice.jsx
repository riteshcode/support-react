import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { Card, Button } from "react-bootstrap";
import { useFieldArray } from "react-hook-form";
import { Trans } from "lang";
import { Row, Col, FormGroup, Label } from "component/UIElement/UIElement";
import FeatherIcon from "feather-icons-react";
import { ErrorMessage } from "@hookform/error-message";

function BulkPrice() {
  const { language } = useSelector((state) => state.login);

  const methods = useFormContext();

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const bulkPrice = useFieldArray({
    control,
    name: "bulkPrice",
  });

  return (
    <Col col={12}>
      <Card className="mb-3">
        <Card.Header as="h6">
          {Trans("WHOLESALE_PRICE", language)}
          <span style={{ float: "right" }}>
            <button
              type="button"
              className="btn btn-xs btn-dark"
              onClick={() => {
                bulkPrice.prepend({});
              }}
            >
              <FeatherIcon icon="plus" fill="white" />
              {Trans("ADD_MORE", language)}
            </button>
          </span>
        </Card.Header>
        {bulkPrice.fields && (
          <Card.Body>
            {bulkPrice.fields.map((item, index) => {
              return (
                <Row key={item.id}>
                  <Col col={4}>
                    <FormGroup>
                      <input
                        {...register(`bulkPrice.${index}.product_qty`, {
                          required: Trans("QTY_REQUIRED", language),
                        })}
                        className="form-control"
                        id={`bulkPrice.${index}.product_qty`}
                        placeholder={Trans("PRODUCT_QTY", language)}
                      />
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name={`bulkPrice.${index}.product_qty`}
                        />
                      </span>
                    </FormGroup>
                  </Col>
                  <Col col={7}>
                    <FormGroup>
                      <input
                        {...register(`bulkPrice.${index}.product_price`, {
                          required: Trans("PRICE_REQUIRED", language),
                        })}
                        className="form-control"
                        id={`bulkPrice.${index}.product_price`}
                        placeholder={Trans("PRODUCT_PRICE", language)}
                      />
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name={`bulkPrice.${index}.product_price`}
                        />
                      </span>
                    </FormGroup>
                  </Col>
                  <Col col={1}>
                    <span style={{ lineHeight: "42px" }}>
                      <FeatherIcon
                        icon="x-square"
                        color="red"
                        onClick={() => bulkPrice.remove(index)}
                        size={20}
                      />
                    </span>
                  </Col>
                </Row>
              );
            })}
          </Card.Body>
        )}
      </Card>
    </Col>
  );
}

export default BulkPrice;
